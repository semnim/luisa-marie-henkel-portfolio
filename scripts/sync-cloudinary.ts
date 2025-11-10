import { db } from '@/lib/db';
import { projectImages, projects, siteImages } from '@/lib/schema';
import { getProjectTitleFromSlug } from '@/lib/utils';
import { v2 as cloudinary, ResourceApiResponse } from 'cloudinary';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryAsset {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
  folder: string;
  context?: {
    custom?: Record<string, string>;
  };
}

interface ProjectAssets {
  [projectName: string]: CloudinaryAsset[];
}

const ProjectSchema = z.object({
  folders: z.array(z.object({ name: z.string() })),
});

type Projects = z.infer<typeof ProjectSchema>;
type Folder = Projects['folders'][number];
type Resources = ResourceApiResponse['resources'];
const ROOT_FOLDER = 'portfolio';

// =================================== <ENTRYPOINT> ================================
syncFromCloudinary();

async function syncFromCloudinary() {
  // Sync site images (home hero & featured)
  await syncSiteImages();

  // Sync project images
  const projectAssets = await fetchProjectAssets();
  for (const [projectName, resources] of Object.entries(projectAssets)) {
    await syncWithDb(projectName, resources);
  }
}
// =================================== </ENTRYPOINT> ==============================

// =================================== <DB OPS> ===================================
async function syncSiteImages() {
  try {
    console.log('\n📸 Syncing site images (home hero & featured)...\n');

    // Fetch from 'site' folder in portfolio
    const result = await cloudinary.api.resources_by_asset_folder('portfolio/site', {
      max_results: 50,
      context: true,
    });

    if (!result.resources || result.resources.length === 0) {
      console.log('  ℹ️  No site images found in portfolio/site folder');
      return;
    }

    // Separate mobile variants
    const mobileVariants = new Map(
      result.resources
        .filter((r: { public_id: string }) => r.public_id.includes('_mobile'))
        .map((r: { public_id: string }) => [r.public_id.replace('_mobile', ''), r])
    );

    // Process each non-mobile image
    const siteResources = result.resources.filter(
      (r: { public_id: string }) => !r.public_id.includes('_mobile')
    );

    for (const [index, resource] of siteResources.entries()) {
      const filename = resource.public_id.split('/').pop() || '';

      // Determine image type from filename
      let imageType: 'home_hero' | 'featured' = 'featured';
      if (filename.toLowerCase().includes('hero') || filename.toLowerCase().includes('home')) {
        imageType = 'home_hero';
      }

      const mobileVariant = mobileVariants.get(resource.public_id);

      // Generate alt text from filename
      const altText = filename
        .replace(/[-_]/g, ' ')
        .replace(/\.[^.]+$/, '')
        .trim();

      await db.insert(siteImages).values({
        imageType,
        isActive: true,
        publicId: resource.public_id,
        imageUrl: resource.secure_url,
        mobilePublicId: mobileVariant?.public_id || null,
        mobileImageUrl: mobileVariant?.secure_url || null,
        title: altText,
        altText,
        order: index,
      });

      console.log(`  ✅ Inserted ${imageType}: ${filename}`);
    }

    console.log(`\n✅ Synced ${siteResources.length} site images\n`);
  } catch (error: any) {
    if (error.error?.http_code === 404) {
      console.log('  ℹ️  No site images folder found (portfolio/site)');
    } else {
      console.error('  ❌ Error syncing site images:', error);
    }
  }
}

async function syncWithDb(projectName: string, resources: CloudinaryAsset[]) {
  const projectSlug = await insertProject(projectName, resources);
  if (projectSlug) {
    await insertProjectImages(projectSlug, resources);
  }
}

async function insertProject(
  projectName: string,
  resources: CloudinaryAsset[]
) {
  const thumbnailResource = resources.find((resource) =>
    resource.public_id.includes('thumbnail')
  );

  if (!thumbnailResource) {
    console.warn(`  ⚠️  No thumbnail found for ${projectName}, skipping`);
    return null;
  }

  try {
    // Check if shooting already exists
    const existing = await db
      .select()
      .from(projects)
      .where(eq(projects.slug, projectName))
      .limit(1);

    if (existing.length > 0) {
      console.log(`  ℹ️  Shooting already exists: ${projectName}`);
      return existing[0].slug;
    }

    const result = await db
      .insert(projects)
      .values({
        slug: projectName,
        title: getProjectTitleFromSlug(projectName),
        description: null,
        publishedAt: new Date(),
        category: 'editorial',
        thumbnailUrl: thumbnailResource.secure_url,
        thumbnailPublicId: thumbnailResource.public_id,
        client: null,
      })
      .returning({ slug: projects.slug });

    console.log(`  ✅ Inserted shooting: ${projectName}`);
    return result[0].slug;
  } catch (error) {
    console.error(`  ❌ Error inserting shooting ${projectName}:`, error);
    return null;
  }
}

async function insertProjectImages(
  projectSlug: string,
  resources: CloudinaryAsset[]
) {
  // Separate mobile and desktop variants
  const mobileVariants = new Map(
    resources
      .filter((r) => r.public_id.includes('_mobile'))
      .map((r) => [r.public_id.replace('_mobile', ''), r])
  );

  // Filter out thumbnails and mobile variants (we'll pair them with desktop)
  const imageResources = resources.filter(
    (r) => !r.public_id.includes('thumbnail') && !r.public_id.includes('_mobile')
  );

  if (imageResources.length === 0) {
    console.log(`  ℹ️  No images to insert`);
    return;
  }

  try {
    for (const [index, resource] of imageResources.entries()) {
      // Determine image type: first image is hero, rest are gallery
      const imageType = index === 0 ? 'hero' : 'gallery';

      // Check if there's a mobile variant for this image
      const mobileVariant = mobileVariants.get(resource.public_id);

      // Generate alt text from filename
      const filename = resource.public_id.split('/').pop() || '';
      const altText = filename
        .replace(/[-_]/g, ' ')
        .replace(/\.[^.]+$/, '')
        .trim();

      await db.insert(projectImages).values({
        projectSlug,
        imageUrl: resource.secure_url,
        publicId: resource.public_id,
        mobilePublicId: mobileVariant?.public_id || null,
        mobileImageUrl: mobileVariant?.secure_url || null,
        imageType,
        variant: mobileVariant ? 'desktop' : 'both',
        altText,
        caption: null,
        width: resource.width,
        height: resource.height,
        format: resource.format,
        order: index,
      });
    }
    console.log(`  ✅ Inserted ${imageResources.length} images`);
  } catch (error) {
    console.error(`  ❌ Error inserting images:`, error);
  }
}
// =================================== </DB OPS> ==================================

// =================================== <CLOUDINARY API> ===========================
async function fetchProjectAssets() {
  try {
    const projects = await fetchProjects();

    console.log('\nFetching assets from each project folder...\n');

    // Group assets by project folder
    const projectAssets: ProjectAssets = {};

    // Fetch assets from each project folder individually
    for (const folder of projects.folders) {
      const resources = await fetchProjectResources(folder);
      projectAssets[folder.name] = resources;
    }

    logProjectAssets(projectAssets);
    // Return structured data for further processing
    return projectAssets;
  } catch (error) {
    console.error('Error fetching from Cloudinary:', error);
    throw error;
  }
}

async function fetchProjects(): Promise<Projects> {
  try {
    console.log('Checking Cloudinary folders...\n');

    const rawProjects = await cloudinary.api.sub_folders(ROOT_FOLDER);

    // Parse and validate with zod - this gives us type inference
    const projects = ProjectSchema.parse(rawProjects);

    console.log(
      'Portfolio subfolders:',
      projects.folders.map((project) => project.name)
    );
    return projects;
  } catch (error) {
    console.error(`  ❌ Error fetching projects:`, error);
    return { folders: [] };
  }
}

async function fetchProjectResources(folder: Folder) {
  const projectName = folder.name;

  const folderPath = `${ROOT_FOLDER}/${projectName}`;

  console.log(`Fetching: ${folderPath}`);

  // Try using resources_by_asset_folder
  try {
    const result = await cloudinary.api.resources_by_asset_folder(folderPath, {
      max_results: 500,
      context: true,
    });

    console.log(`  Found ${result.resources.length} assets`);
    return convertResources(projectName, result.resources);
  } catch (error) {
    console.error(
      `  ❌ Error fetching project resources for ${projectName}:`,
      error
    );
    return [];
  }
}
// =================================== </CLOUDINARY API> ==========================

// =================================== <UTILITIES> ================================
function convertResources(projectName: string, resources: Resources) {
  return resources.map(
    (asset: {
      public_id: string;
      secure_url: string;
      width: number;
      height: number;
      format: string;
      created_at: string;
      context?: { custom?: Record<string, string> };
    }) => ({
      public_id: asset.public_id,
      secure_url: asset.secure_url,
      width: asset.width,
      height: asset.height,
      format: asset.format,
      created_at: asset.created_at,
      folder: projectName,
      context: asset.context,
    })
  );
}

function logProjectAssets(projectAssets: ProjectAssets) {
  // Display organized results
  console.log('\nProjects found:');
  console.log('================\n');

  for (const [projectName, assets] of Object.entries(projectAssets)) {
    console.log(`📁 ${projectName} (${assets.length} images)`);
    assets.forEach((asset, idx) => {
      const filename = asset.public_id.split('/').pop();
      console.log(`  ${idx + 1}. ${filename} (${asset.width}x${asset.height})`);
    });
    console.log('');
  }
} // =================================== </UTILITIES> ===============================

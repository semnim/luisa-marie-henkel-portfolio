import { db } from '@/lib/db';
import { shootingImages, shootings } from '@/lib/schema';
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
  const projectAssets = await fetchProjectAssets();
  for (const [projectName, resources] of Object.entries(projectAssets)) {
    await syncWithDb(projectName, resources);
  }
}
// =================================== </ENTRYPOINT> ==============================

// =================================== <DB OPS> ===================================
async function syncWithDb(projectName: string, resources: CloudinaryAsset[]) {
  const shootingId = await insertShooting(projectName, resources);
  if (shootingId) {
    await insertShootingImages(shootingId, resources);
  }
}

async function insertShooting(
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
      .from(shootings)
      .where(eq(shootings.slug, projectName))
      .limit(1);

    if (existing.length > 0) {
      console.log(`  ℹ️  Shooting already exists: ${projectName}`);
      return existing[0].id;
    }

    const result = await db
      .insert(shootings)
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
      .returning({ id: shootings.id });

    console.log(`  ✅ Inserted shooting: ${projectName}`);
    return result[0].id;
  } catch (error) {
    console.error(`  ❌ Error inserting shooting ${projectName}:`, error);
    return null;
  }
}

async function insertShootingImages(
  shootingId: number,
  resources: CloudinaryAsset[]
) {
  // Filter out thumbnail
  const imageResources = resources.filter(
    (r) => !r.public_id.includes('thumbnail')
  );

  if (imageResources.length === 0) {
    console.log(`  ℹ️  No images to insert`);
    return;
  }

  try {
    for (const [index, resource] of imageResources.entries()) {
      await db.insert(shootingImages).values({
        shootingId,
        imageUrl: resource.secure_url,
        publicId: resource.public_id,
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

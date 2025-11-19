type Props = {
  name: string;
  email: string;
  message: string;
};

export const EmailTemplate = ({ name, email, message }: Props) => {
  return (
    <>
      <h2>New Contact Form Submission</h2>
      <p>
        <strong>Name:</strong> {name}
      </p>
      <p>
        <strong>Email:</strong> {email}
      </p>
      <p>
        <strong>Message:</strong>
      </p>
      <p>{message.replace(/\n/g, '<br>')}</p>
      <hr />
      <p>
        <small>Submitted at: {new Date().toISOString()}</small>
      </p>
    </>
  );
};

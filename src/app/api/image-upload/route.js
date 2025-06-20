import ImageKit from 'imagekit';

const imageKit = new ImageKit({
  publicKey: "public_8yvMnIE6Ag5h8A6IENHHk1EFRe0=",
  privateKey: "private_Dr+AVFIhUWDK7Fnxl8hoN6CYI0I=",
  urlEndpoint: "https://ik.imagekit.io/msxn2g2wt",
});

export async function POST(req) {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: `Method ${req.method} Not Allowed` }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse form data from Next.js `Request` object
    const formData = await req.formData();
    const file = formData.get('file'); // Get file input

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Convert file to buffer for ImageKit upload
    const buffer = await file.arrayBuffer();
    const fileData = Buffer.from(buffer);

    // Upload to ImageKit
    const result = await imageKit.upload({
      file: fileData,
      fileName: file.name,
    });

    return new Response(JSON.stringify({
      success: true,
      data: {
        fileId: result.fileId,
        thumbnail: result.thumbnailUrl,
        url: result.url,
        width: result.width,
        height: result.height,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new Response(JSON.stringify({ success: false, error: 'Server Error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

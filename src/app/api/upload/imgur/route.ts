import { NextRequest, NextResponse } from 'next/server';

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID || '546c25a59c58ad7';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    // Convert File to base64 for Imgur API
    const arrayBuffer = await image.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    const imgurFormData = new FormData();
    imgurFormData.append('image', base64);
    imgurFormData.append('type', 'base64');

    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
      },
      body: imgurFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Imgur API error:', errorText);
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to upload to Imgur',
          details: response.status === 429 ? 'Rate limit exceeded' : 'Upload service unavailable'
        },
        { status: response.status }
      );
    }

    const imgurResponse = await response.json();

    if (!imgurResponse.success) {
      return NextResponse.json(
        { success: false, error: 'Imgur upload failed' },
        { status: 500 }
      );
    }

    const { data } = imgurResponse;

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        url: data.link,
        deleteUrl: `https://imgur.com/delete/${data.deletehash}`,
        deleteHash: data.deletehash,
        filename: image.name,
        size: image.size
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ deleteHash: string }> }
) {
  try {
    const { deleteHash } = await params;

    const response = await fetch(`https://api.imgur.com/3/image/${deleteHash}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete image' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { ApiResponse, UploadResult } from '@/types/upload';

export class UploadAPI {
  static async uploadToImgur(file: File | Blob): Promise<ApiResponse<UploadResult>> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/imgur', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  static async uploadFile(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<UploadResult>> {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('image', file);

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        try {
          if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText);
            resolve(result);
          } else {
            resolve({
              success: false,
              error: `Upload failed with status ${xhr.status}`
            });
          }
        } catch (error) {
          resolve({
            success: false,
            error: 'Failed to parse response'
          });
        }
      });

      xhr.addEventListener('error', () => {
        resolve({
          success: false,
          error: 'Network error occurred'
        });
      });

      xhr.open('POST', '/api/upload/imgur');
      xhr.send(formData);
    });
  }

  static async deleteImage(deleteHash: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`/api/upload/imgur/${deleteHash}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed'
      };
    }
  }

  static validateFile(file: File, maxSize: number, acceptedTypes: string[]): {
    valid: boolean;
    error?: string;
  } {
    if (!acceptedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not supported`
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`
      };
    }

    return { valid: true };
  }
}
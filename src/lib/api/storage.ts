import { supabase } from '../supabase';

export async function uploadLogo(file: File, userId: string): Promise<string> {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Upload the file
    const { data, error: uploadError } = await supabase.storage
      .from('business-logos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('business-logos')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw error;
  }
}

export async function deleteLogo(url: string): Promise<void> {
  try {
    // Extract the file path from the URL
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `${urlParts[urlParts.length - 2]}/${fileName}`;

    const { error } = await supabase.storage
      .from('business-logos')
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting logo:', error);
    throw error;
  }
}
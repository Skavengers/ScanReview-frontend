export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Image upload failed');
  const data = await res.json();
  return data.imageUrl; // Cloudinary URL
};

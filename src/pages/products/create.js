import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProductForm from '@/components/ProductForm';

export default function CreateProduct() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';

      if (imageFile) {
        const data = new FormData();
        data.append('file', imageFile);
        data.append('upload_preset', 'product_image');

        const res = await fetch(`https://api.cloudinary.com/v1_1/dyvkliqs4/image/upload`, {
          method: 'POST',
          body: data,
        });

        const json = await res.json();
        if (!res.ok) {
          alert('Upload ảnh thất bại');
          setLoading(false);
          return;
        }

        imageUrl = json.secure_url;
      }

      const postRes = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          image: imageUrl,
        }),
      });

      if (postRes.ok) {
        router.push('/');
      } else {
        const err = await postRes.json();
        alert(err.error || 'Đã có lỗi xảy ra');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <ProductForm
      form={form}
      onChange={handleChange}
      onFileChange={handleFileChange}
      onSubmit={handleSubmit}
      previewUrl={previewUrl}
      loading={loading}
    />
  );
}

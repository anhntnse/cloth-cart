import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProductForm from '@/components/ProductForm';

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({ name: '', description: '', price: '', id: null });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoadingData(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Không tải được sản phẩm');
        const data = await res.json();

        setForm({
          id: data._id,
          name: data.name || '',
          description: data.description || '',
          price: data.price?.toString() || '',
        });

        setPreviewUrl(data.image || null);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoadingData(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = previewUrl || '';

      if (imageFile) {
        const data = new FormData();
        data.append('file', imageFile);
        data.append('upload_preset', 'product_image');

        const res = await fetch('https://api.cloudinary.com/v1_1/dyvkliqs4/image/upload', {
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

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          image: imageUrl,
        }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        const err = await res.json();
        alert(err.error || 'Có lỗi xảy ra khi cập nhật');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl && imageFile) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl, imageFile]);

  if (loadingData) return <p className="text-center mt-10">Đang tải dữ liệu sản phẩm...</p>;

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

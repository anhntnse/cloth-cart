import Image from 'next/image';

export default function ProductForm({
  form,
  onChange,
  onFileChange,
  onSubmit,
  previewUrl,
  loading
}) {
  return (
    <div className="max-w-5xl mx-auto p-8 mt-10 bg-white shadow-lg rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
        {form.id ? 'Edit Product' : 'Create Product'}
      </h2>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Form bên trái */}
        <form onSubmit={onSubmit} className="w-full md:w-1/2 space-y-5">
          <div>
            <label className="block text-gray-600 mb-1">Product Name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Write a short description..."
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Price</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={onChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="e.g. 898000"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-xl text-white font-semibold transition-all ${
              loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-800'
            }`}
          >
            {loading ? 'Uploading...' : form.id ? 'Update Product' : 'Create Product'}
          </button>
        </form>

        {/* Preview bên phải */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          {previewUrl ? (
            <div>
              <p className="text-gray-500 mb-2 text-center">Preview:</p>
              <Image
                src={previewUrl}
                alt="Preview"
                width={400}
                height={400}
                className="w-full max-h-[400px] object-contain rounded-xl border border-gray-300 shadow-sm"
              />
            </div>
          ) : (
            <div className="text-center text-gray-400 italic">
              No image selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

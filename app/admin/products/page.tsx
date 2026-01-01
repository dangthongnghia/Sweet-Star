"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: 'dung-cu',
        isCombo: false,
        recipeUrl: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert("Đã xóa sản phẩm!");
                fetchProducts();
            } else {
                alert("Lỗi khi xóa sản phẩm");
            }
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const handleEdit = (product: any) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            imageUrl: product.imageUrl,
            category: typeof product.category === 'object' ? product.category.slug : product.category,
            isCombo: product.isCombo,
            recipeUrl: product.recipeUrl || ''
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            imageUrl: '',
            category: 'dung-cu',
            isCombo: false,
            recipeUrl: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId ? `/api/products/${editingId}` : '/api/products';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price)
                })
            });

            if (res.ok) {
                alert(editingId ? "Cập nhật thành công!" : "Thêm sản phẩm thành công!");
                resetForm();
                fetchProducts();
            } else {
                alert("Lỗi khi lưu sản phẩm");
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                    className="bg-primary text-black px-4 py-2 rounded-lg flex items-center hover:opacity-90 transition font-medium"
                >
                    <Plus className="w-5 h-5 mr-2" /> Thêm sản phẩm
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="font-bold mb-4 text-xl">{editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            className="border p-2 rounded focus:ring-primary focus:border-primary"
                            placeholder="Tên sản phẩm"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <input
                            className="border p-2 rounded focus:ring-primary focus:border-primary"
                            placeholder="Giá (VNĐ)"
                            type="number"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                        <div className="border p-2 rounded flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Hình ảnh</label>

                            {/* Preview */}
                            {formData.imageUrl && (
                                <div className="relative w-full h-40 bg-gray-100 rounded overflow-hidden">
                                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* Upload Button */}
                            {!formData.imageUrl && (
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            const data = new FormData();
                                            data.append('file', file);

                                            try {
                                                // Show simple loading feedback if needed
                                                const res = await fetch('/api/upload', {
                                                    method: 'POST',
                                                    body: data
                                                });
                                                if (res.ok) {
                                                    const json = await res.json();
                                                    setFormData({ ...formData, imageUrl: json.url });
                                                } else {
                                                    alert('Upload thất bại');
                                                }
                                            } catch (err) {
                                                console.error(err);
                                                alert('Lỗi upload');
                                            }
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded hover:bg-gray-50 transition">
                                        <p className="text-gray-500 text-sm">Nhấn để chọn ảnh</p>
                                    </div>
                                </div>
                            )}

                            <input
                                // Hidden input to store URL but allow manual edit if absolutely needed? 
                                // Let's just keep it hidden or read-only debug view
                                type="text"
                                className="text-xs text-gray-400 mt-1 border-none bg-transparent p-0"
                                placeholder="URL ảnh (Upload để tự điền)"
                                value={formData.imageUrl}
                                readOnly
                            />
                        </div>
                        <select
                            className="border p-2 rounded focus:ring-primary focus:border-primary"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="dung-cu">Dụng cụ</option>
                            <option value="nguyen-lieu">Nguyên liệu</option>
                            <option value="combo">Combo</option>
                            <option value="cong-thuc">Công thức</option>
                            <option value="banh">Bánh thành phẩm</option>
                        </select>

                        <div className="col-span-1 md:col-span-2 border p-3 rounded bg-gray-50">
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id="isCombo"
                                    checked={formData.isCombo}
                                    onChange={e => setFormData({ ...formData, isCombo: e.target.checked })}
                                    className="mr-2 h-4 w-4 text-primary focus:ring-primary"
                                />
                                <label htmlFor="isCombo" className="font-medium">Là Combo (Có tặng công thức)?</label>
                            </div>
                            {formData.isCombo && (
                                <input
                                    className="border p-2 rounded w-full mt-2 focus:ring-primary focus:border-primary"
                                    placeholder="URL Công thức (dành cho người mua Combo)"
                                    value={formData.recipeUrl}
                                    onChange={e => setFormData({ ...formData, recipeUrl: e.target.value })}
                                />
                            )}
                        </div>

                        <textarea
                            className="border p-2 rounded col-span-1 md:col-span-2 focus:ring-primary focus:border-primary"
                            placeholder="Mô tả chi tiết"
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                        />

                        <div className="col-span-1 md:col-span-2 flex gap-2">
                            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex-1">
                                {editingId ? "Cập nhật" : "Lưu sản phẩm"}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product: any) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img src={product.imageUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 capitalize">
                                        {typeof product.category === 'object' ? product.category?.name : product.category}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-900 mr-3" title="Sửa">
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900" title="Xóa">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

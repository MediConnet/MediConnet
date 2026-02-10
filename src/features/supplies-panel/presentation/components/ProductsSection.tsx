import {
  Add,
  Edit,
  Delete,
  Inventory,
  PhotoCamera,
} from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Avatar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { 
  getProductsAPI, 
  createProductAPI, 
  updateProductAPI, 
  deleteProductAPI 
} from "../../infrastructure/products.api";
import type { Product } from "../../domain/Product.entity";
import { useAuthStore } from "../../../../app/store/auth.store";

const categories = [
  "Movilidad",
  "Ortopedia",
  "Rehabilitación",
  "Ayudas Técnicas",
  "Otros",
];

export const ProductsSection = () => {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    category: "Movilidad",
    price: 0,
    stock: 0,
    isActive: true,
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, [user?.id]);

  const loadProducts = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Intentar cargar del backend
      try {
        const data = await getProductsAPI(user.id);
        setProducts(data);
        // Guardar en localStorage como backup
        localStorage.setItem(`products-${user.id}`, JSON.stringify(data));
      } catch (backendError) {
        console.warn('Backend no disponible, usando localStorage');
        // Si falla, cargar de localStorage
        const saved = localStorage.getItem(`products-${user.id}`);
        if (saved) {
          setProducts(JSON.parse(saved));
        } else {
          setProducts([]);
        }
      }
    } catch (err: any) {
      console.error('Error loading products:', err);
      setError(null); // No mostrar error, solo usar datos vacíos
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || "",
        category: product.category,
        price: product.price,
        stock: product.stock,
        isActive: product.isActive,
        image: product.image || "",
      });
      setImagePreview(product.image || "");
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        category: "Movilidad",
        price: 0,
        stock: 0,
        isActive: true,
        image: "",
      });
      setImagePreview("");
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      category: "Movilidad",
      price: 0,
      stock: 0,
      isActive: true,
      image: "",
    });
    setImagePreview("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async () => {
    if (!user?.id) return;
    
    try {
      setSaving(true);
      setError(null);

      let updatedProducts: Product[];

      try {
        // Intentar guardar en el backend
        if (editingProduct) {
          const updated = await updateProductAPI(editingProduct.id, formData);
          updatedProducts = products.map(p => p.id === updated.id ? updated : p);
        } else {
          const created = await createProductAPI(formData);
          updatedProducts = [...products, created];
        }
      } catch (backendError) {
        console.warn('Backend no disponible, guardando en localStorage');
        // Si falla el backend, guardar localmente
        if (editingProduct) {
          updatedProducts = products.map(p => 
            p.id === editingProduct.id ? { ...p, ...formData } : p
          );
        } else {
          const newProduct: Product = {
            id: `local-${Date.now()}`,
            name: formData.name || '',
            description: formData.description || '',
            category: formData.category || 'Movilidad',
            price: formData.price || 0,
            stock: formData.stock || 0,
            isActive: formData.isActive !== false,
            image: formData.image || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          updatedProducts = [...products, newProduct];
        }
      }

      setProducts(updatedProducts);
      // Guardar en localStorage
      localStorage.setItem(`products-${user.id}`, JSON.stringify(updatedProducts));
      handleCloseModal();
    } catch (err: any) {
      console.error('Error saving product:', err);
      setError(err.message || 'Error al guardar producto');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!user?.id) return;
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) {
      return;
    }

    try {
      setError(null);
      
      try {
        await deleteProductAPI(productId);
      } catch (backendError) {
        console.warn('Backend no disponible, eliminando de localStorage');
      }
      
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      // Actualizar localStorage
      localStorage.setItem(`products-${user.id}`, JSON.stringify(updatedProducts));
    } catch (err: any) {
      console.error('Error deleting product:', err);
      setError(err.message || 'Error al eliminar producto');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Inventory sx={{ fontSize: 32, color: "#06b6d4" }} />
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Gestión de Productos
            </h3>
            <p className="text-sm text-gray-500">
              {products.length} productos registrados
            </p>
          </div>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
          sx={{
            textTransform: "none",
            backgroundColor: "#06b6d4",
            "&:hover": { backgroundColor: "#0891b2" },
          }}
        >
          Agregar Producto
        </Button>
      </div>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9fafb" }}>
              <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Categoría</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Precio
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Stock
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Estado
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No hay productos registrados
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={product.image}
                        alt={product.name}
                        sx={{ width: 48, height: 48 }}
                      >
                        <Inventory />
                      </Avatar>
                      <div>
                        <Typography fontWeight={600}>{product.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.description}
                        </Typography>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={600}>
                      {formatCurrency(product.price)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      fontWeight={600}
                      color={product.stock > 0 ? "success.main" : "error.main"}
                    >
                      {product.stock}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="caption"
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: product.isActive ? "#d1fae5" : "#fee2e2",
                        color: product.isActive ? "#065f46" : "#991b1b",
                        fontWeight: 600,
                      }}
                    >
                      {product.isActive ? "Activo" : "Inactivo"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenModal(product)}
                      sx={{ color: "#06b6d4" }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteProduct(product.id)}
                      sx={{ color: "#ef4444" }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para agregar/editar producto */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {editingProduct ? "Editar Producto" : "Nuevo Producto"}
          </Typography>

          <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Imagen */}
            <Box sx={{ textAlign: "center" }}>
              <Avatar
                src={imagePreview}
                sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
              >
                <Inventory sx={{ fontSize: 48 }} />
              </Avatar>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <Button
                variant="outlined"
                startIcon={<PhotoCamera />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ textTransform: "none" }}
              >
                Subir Imagen
              </Button>
            </Box>

            <TextField
              label="Nombre del Producto"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />

            <TextField
              label="Descripción"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
            />

            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                label="Categoría"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Precio"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
              fullWidth
              required
              InputProps={{ startAdornment: "$" }}
            />

            <TextField
              label="Stock"
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: parseInt(e.target.value) })
              }
              fullWidth
              required
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
              }
              label="Producto Activo"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} sx={{ textTransform: "none" }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveProduct}
            variant="contained"
            disabled={saving || !formData.name || !formData.price}
            sx={{
              textTransform: "none",
              backgroundColor: "#06b6d4",
              "&:hover": { backgroundColor: "#0891b2" },
            }}
          >
            {saving ? "Guardando..." : editingProduct ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

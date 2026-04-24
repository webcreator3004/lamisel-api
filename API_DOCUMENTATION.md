# Laminate API Documentation

## Quick Start

**Base URL**: `http://localhost:5000`
**Authentication**: Add `Authorization: Bearer <token>` header to protected endpoints

---

## Authentication (`/api/auth`)

### Register
```
POST /api/auth/register
{
  "username": "string",
  "password": "string",
  "name": "string",
  "phoneNumber": "string",
  "email": "string",
  "profileImg": "string" (optional)
}
```

### Login
```
POST /api/auth/login
{
  "username": "string",
  "password": "string"
}
→ Returns: { "token": "jwt_token" }
```

### Get Profile
```
GET /api/auth/profile
Authorization: Bearer <token>
```

### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer <token>
{
  "name": "string",
  "phoneNumber": "string",
  "email": "string",
  "profileImg": "string" (optional)
}
```

### Upload Profile Image
```
PUT /api/auth/profile/image
Authorization: Bearer <token>
Content-Type: multipart/form-data
Form Data: profileImg (file)
```

---

## Previews (`/api/previews`)

### Create Preview
```
POST /api/previews
Authorization: Bearer <token>
Content-Type: multipart/form-data
Form Data: 
- previewName: string
- previewCategory: string
- previewImgs: files (max 2)
```

### Get All Previews
```
GET /api/previews
```

### Get Single Preview
```
GET /api/previews/:id
```

### Update Preview
```
PUT /api/previews/:id
Authorization: Bearer <token>
{
  "previewName": "string",
  "previewCategory": "string"
}
```

### Delete Preview
```
DELETE /api/previews/:id
Authorization: Bearer <token>
```

---

## Products (`/api/products`)

### Create Product
```
POST /api/products
Authorization: Bearer <token>
Content-Type: multipart/form-data
Form Data:
- productName: string
- series: string
- collection: string
- productImage: file (optional)
```

### Get All Products
```
GET /api/products
```

### Get Single Product
```
GET /api/products/:id
```

### Update Product
```
PUT /api/products/:id
Authorization: Bearer <token>
{
  "productName": "string",
  "series": "string",
  "collection": "string"
}
```

### Delete Product
```
DELETE /api/products/:id
Authorization: Bearer <token>
```

---

## Save Designs (`/api/designs`)

### Create Design
```
POST /api/designs
Authorization: Bearer <token>
Content-Type: multipart/form-data
Form Data:
- preview: string (Preview ID)
- product: string (Product ID)
- designImage: file 
```

### Get User Designs
```
GET /api/designs
Authorization: Bearer <token>
```

### Delete Design
```
DELETE /api/designs/:id
Authorization: Bearer <token>
```

---

## Favorites (`/api/favorites`)

### Add to Favorites
```
POST /api/favorites
Authorization: Bearer <token>
{
  "user": "string" (User ID),
  "design": "string" (Design ID)
}
```

### Get User Favorites
```
GET /api/favorites
Authorization: Bearer <token>
```

### Remove from Favorites
```
DELETE /api/favorites/:id
Authorization: Bearer <token>
```

---

## Data Models

### User
```json
{
  "username": "string",
  "name": "string",
  "profileImg": "string",
  "phoneNumber": "string",
  "email": "string"
}
```

### Preview
```json
{
  "previewName": "string",
  "previewImgs": ["string"],
  "previewCategory": "string"
}
```

### Product
```json
{
  "productName": "string",
  "productImage": "string",
  "series": "string",
  "collection": "string"
}
```

### Design
```json
{
  "user": "User ID",
  "preview": "Preview ID",
  "product": "Product ID",
  "designImage": "string"
}
```

### Favorite
```json
{
  "favoriteId": "Number",
  "user": "User ID",
  "design": "Design ID"
}
```

---

## Quick Examples

### 1. Register & Login
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"123","name":"John","email":"john@test.com"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"123"}'
```

### 2. Create Design
```bash
curl -X POST http://localhost:5000/api/designs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "preview=PREVIEW_ID" \
  -F "product=PRODUCT_ID" \
  -F "designImage=@image.jpg"
```

### 3. Get Products
```bash
curl http://localhost:5000/api/products
```

---

## Setup

1. Install: `npm install`
2. Create `.env` file:
   ```
   MONGO_URI=mongodb://your_db_url
   PORT=5000
   ```
3. Start: `node index.js`

---

## Notes

- All images are stored in `/uploads` folder
- Images accessible via `/uploads/filename`
- JWT tokens expire in 1 day
- Passwords are hashed with bcrypt



<!-- TOTAL API END -->

Authentication (/api/auth) - 6 endpoints

  POST /api/auth/register
  POST /api/auth/login
  GET /api/auth/profile
  PUT /api/auth/profile
  PUT /api/auth/profile/image
  DELETE /api/auth/profile (logout)


Previews (/api/previews) - 5 endpoints

  POST /api/previews
  GET /api/previews
  GET /api/previews/:id
  PUT /api/previews/:id
  DELETE /api/previews/:id  


Products (/api/products) - 5 endpoints

  POST /api/products
  GET /api/products
  GET /api/products/:id
  PUT /api/products/:id
  DELETE /api/products/:id


Designs (/api/designs) - 3 endpoints

  POST /api/designs
  GET /api/designs
  DELETE /api/designs/:id


Favorites (/api/favorites) - 3 endpoints

  POST /api/favorites
  GET /api/favorites
  DELETE /api/favorites/:id
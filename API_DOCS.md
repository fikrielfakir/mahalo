# Homzen Real Estate — API Documentation

**Base URL:** `https://api.yourdomain.com/api/v1`  
**Format:** JSON  
**Authentication:** Bearer Token (Sanctum) — required only for write/private endpoints

---

## Response Format

All endpoints return:

```json
{
  "data": [...],
  "links": { "first": "...", "last": "...", "prev": null, "next": "..." },
  "meta": { "current_page": 1, "last_page": 5, "per_page": 10, "total": 47 },
  "error": false,
  "message": null
}
```

---

## Properties

### List Properties
```
GET /properties
```

| Parameter        | Type    | Description                                   |
|-----------------|---------|-----------------------------------------------|
| `page`          | integer | Page number. Default: 1                       |
| `per_page`      | integer | Items per page. Default: 10, Max: 100         |
| `search`        | string  | Search by name or location                    |
| `type`          | string  | Filter by type: `sale` or `rent`              |
| `is_featured`   | integer | Filter featured properties: `1` or `0`        |
| `city_id`       | integer | Filter by city ID                             |
| `state_id`      | integer | Filter by state ID                            |
| `country_id`    | integer | Filter by country ID                          |
| `category_id`   | integer | Filter by category ID                         |
| `project_id`    | integer | Filter by project ID                          |
| `min_price`     | number  | Minimum price                                 |
| `max_price`     | number  | Maximum price                                 |
| `min_square`    | number  | Minimum square footage                        |
| `max_square`    | number  | Maximum square footage                        |
| `number_bedroom`| integer | Number of bedrooms                            |
| `number_bathroom`| integer| Number of bathrooms                           |
| `features`      | string  | Comma-separated feature IDs                   |
| `facilities`    | string  | Comma-separated facility IDs                  |
| `order_by`      | string  | Sort by: `created_at`, `name`, `price`        |
| `order`         | string  | Sort direction: `asc` or `desc`               |

**Example:** `GET /properties?type=sale&is_featured=1&per_page=8`

---

### Search Properties
```
GET /properties/search?q=villa
```

| Parameter | Type   | Description          |
|-----------|--------|----------------------|
| `q`       | string | Search keyword       |

---

### Get Available Filters
```
GET /properties/filters
```
Returns available price ranges, cities, categories, features, facilities.

---

### Get Property by Slug
```
GET /properties/{slug}
```

**Example:** `GET /properties/blue-sky-residences`

---

### Get Property by ID
```
GET /properties/id/{id}
```

**Example:** `GET /properties/id/42`

---

### Get Property Reviews
```
GET /properties/{property_id}/reviews
```

---

## Projects

### List Projects
```
GET /projects
```

| Parameter     | Type    | Description                           |
|--------------|---------|---------------------------------------|
| `page`       | integer | Page number. Default: 1               |
| `per_page`   | integer | Items per page. Default: 10, Max: 100 |
| `search`     | string  | Search by name                        |
| `is_featured`| integer | Filter featured: `1` or `0`           |
| `city_id`    | integer | Filter by city ID                     |
| `order_by`   | string  | Sort by: `created_at`, `name`         |
| `order`      | string  | `asc` or `desc`                       |

---

### Search Projects
```
GET /projects/search?q=downtown
```

---

### Get Project by Slug
```
GET /projects/{slug}
```

---

### Get Project by ID
```
GET /projects/id/{id}
```

---

### Get Properties in a Project
```
GET /projects/id/{id}/properties
```

---

### Get Available Project Filters
```
GET /projects/filters
```

---

## Agents

### List Agents
```
GET /agents
```

| Parameter     | Type    | Description                                    |
|--------------|---------|------------------------------------------------|
| `page`       | integer | Page number. Default: 1                        |
| `per_page`   | integer | Items per page. Default: 10, Max: 100          |
| `search`     | string  | Search by name                                 |
| `is_featured`| integer | Filter featured agents: `1` or `0`             |
| `order_by`   | string  | Sort by: `created_at`, `first_name`, `last_name`|
| `order`      | string  | `asc` or `desc`                                |

---

### Get Agent by ID
```
GET /agents/{id}
```

---

### Get Agent's Properties
```
GET /agents/{id}/properties
```

---

### Get Agent's Projects
```
GET /agents/{id}/projects
```

---

## Categories

### List Categories
```
GET /categories
```

---

### Get Category by Slug
```
GET /categories/{slug}
```

---

### Get Category by ID
```
GET /categories/id/{id}
```

---

### Get Category's Properties
```
GET /categories/id/{id}/properties
```

---

### Get Available Category Filters
```
GET /categories/filters
```

---

## Features

### List Features (paginated)
```
GET /features
```

### List All Features
```
GET /features/all
```

### Get Feature by ID
```
GET /features/{id}
```

---

## Facilities

### List Facilities (paginated)
```
GET /facilities
```

### List All Facilities
```
GET /facilities/all
```

### Get Facility by ID
```
GET /facilities/{id}
```

---

## Consultations

### Submit a Consultation Request
```
POST /consults
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "content": "I am interested in this property.",
  "property_id": 42
}
```

---

### Get Consultation Custom Fields
```
GET /consults/custom-fields
```

---

## Authentication (Sanctum)

### Login
```
POST /auth/login
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "data": {
    "token": "1|AbCdEf...",
    "token_type": "Bearer"
  }
}
```

---

### Using the Token

Add the token to your request headers:

```
Authorization: Bearer 1|AbCdEf...
```

---

## Authenticated Endpoints

> These endpoints require `Authorization: Bearer {token}` header.

### Get My Profile
```
GET /account/profile
```

### Post a Property Review
```
POST /properties/{property_id}/reviews
```

**Body:**
```json
{
  "star": 5,
  "comment": "Amazing property!"
}
```

### Update a Review
```
PUT /reviews/{id}
```

### Delete a Review
```
DELETE /reviews/{id}
```

---

## Error Responses

| Status | Meaning                                   |
|--------|-------------------------------------------|
| `200`  | Success                                   |
| `401`  | Unauthenticated — token missing/invalid   |
| `403`  | Forbidden — insufficient permissions      |
| `404`  | Resource not found                        |
| `422`  | Validation error                          |
| `500`  | Server error                              |

**Validation error example:**
```json
{
  "data": null,
  "error": true,
  "message": "The email field is required."
}
```

---

## Frontend Integration Example

```javascript
// Set your backend URL in frontend/.env
// VITE_API_URL=https://api.yourdomain.com

import { propertiesApi } from './src/api/client'

// Fetch featured properties
const result = await propertiesApi.featured(8)
console.log(result.data) // array of properties

// Search
const search = await propertiesApi.search({ q: 'villa', type: 'sale' })
console.log(search.data)
```

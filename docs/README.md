# Admin Organizations

This is a admin application for managing `Roles` and `Permissions` for organizations on a B2B Store.

## Usage

Install latest version of this app, then you can see the features in admin view. 

```js
vtex install vtex.admin-authorization@1.x
```
>
> ### Link application to development workspace
> - clone the application to your working environment and checkout to the correct branch 
> - link this app to your workspace (`vtex link --verbose`)

### Prerequisites

In order to run this application following master data schemas should be created. 
Use `MASTER DATA API - V2` in vtex api documentation to create those schemas (https://developers.vtex.com/reference#master-data-api-v2-overview)

These schemas are shared among several applications `vtex-admin-authorization`, `vtex-permission-challenge` and `vtex-my-organization`, therefore if you have already created these schemas you can ignore this step


<details><summary>Permissions</summary>

``` 

Data Entity Name: BusinessPermission
Schema Name: business-permission-schema-v1

{
	"properties": {
		"name": {
			"type": "string"
		},
		"label": {
			"type": "string"
		}
	},
	"v-default-fields": [
		"name",
		"label",
		"id"
	],
	"required": [
		"name"
	],
	"v-indexed": [
		"name"
	],
	"v-security": {
		"allowGetAll": true,
		"publicRead": [
			"name",
			"label",
			"id"
		],
		"publicWrite": [
			"name",
			"label"
		],
		"publicFilter": [
			"name",
			"id"
		]
	}
}

```
</details>

<details><summary>Roles</summary>

``` 

Data Entity Name: BusinessRole
Schema Name: business-role-schema-v1

{
	"properties": {
		"name": {
			"type": "string"
		},
		"label": {
			"type": "string"
		},
		"permissions": {
			"type": "string"
		}
	},
	"definitions": {
		"permission": {
			"type": "string"
		}
	},
	"v-default-fields": [
		"name",
		"label",
		"id",
		"permissions"
	],
	"required": [
		"name"
	],
	"v-indexed": [
		"name"
	],
	"v-security": {
		"allowGetAll": true,
		"publicRead": [
			"name",
			"label",
			"permissions",
			"id"
		],
		"publicWrite": [
			"name",
			"label",
			"permissions"
		],
		"publicFilter": [
			"name",
			"id"
		]
	}
}

```
</details>

### Add Required roles
You will need `manager` role to be created for fully functioning other related applications
Use `label` as `Manager` and `name` as `manager` to create `Manager` role

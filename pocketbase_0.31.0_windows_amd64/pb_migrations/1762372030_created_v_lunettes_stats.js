/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_1802620688",
        "hidden": false,
        "id": "_clone_BhTA",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "id_utilisateur",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "number1344867136",
        "max": null,
        "min": null,
        "name": "nb_creations",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "json1421237099",
        "maxSize": 1,
        "name": "derniere_creation",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      }
    ],
    "id": "pbc_2059538788",
    "indexes": [],
    "listRule": null,
    "name": "v_lunettes_stats",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT\n  id_utilisateur AS id,\n  id_utilisateur,\n  COUNT(*)       AS nb_creations,\n  MAX(created)   AS derniere_creation\nFROM Lunette\nGROUP BY id_utilisateur;\n",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2059538788");

  return app.delete(collection);
})

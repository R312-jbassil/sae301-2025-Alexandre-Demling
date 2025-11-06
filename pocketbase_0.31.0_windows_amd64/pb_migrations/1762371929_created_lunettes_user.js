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
        "id": "_clone_pucI",
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
        "id": "_clone_JyQM",
        "max": null,
        "min": null,
        "name": "largeur_pont_mm",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "_clone_e8zy",
        "max": null,
        "min": null,
        "name": "taille_verre_mm",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_1897857566",
        "hidden": false,
        "id": "_clone_tSk2",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "materiaux_monture",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_1897857566",
        "hidden": false,
        "id": "_clone_J7ux",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "materiaux_branche",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_1659093395",
        "hidden": false,
        "id": "_clone_9wWN",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "couleur_monture",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_1659093395",
        "hidden": false,
        "id": "_clone_VCZH",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "couleur_branche",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "convertURLs": false,
        "hidden": false,
        "id": "_clone_cnkc",
        "maxSize": 0,
        "name": "code_svg",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "editor"
      },
      {
        "hidden": false,
        "id": "_clone_VbBM",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_3397078760",
    "indexes": [],
    "listRule": null,
    "name": "lunettes_user",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT\n  id,\n  id_utilisateur,\n  largeur_pont_mm,\n  taille_verre_mm,\n  materiaux_monture,\n  materiaux_branche,\n  couleur_monture,\n  couleur_branche,\n  code_svg,\n  created\nFROM Lunette;\n",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3397078760");

  return app.delete(collection);
})

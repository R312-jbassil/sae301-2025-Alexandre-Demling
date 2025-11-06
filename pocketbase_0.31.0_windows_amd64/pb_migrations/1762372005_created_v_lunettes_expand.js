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
        "id": "_clone_W4GB",
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
        "id": "_clone_XtW5",
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
        "id": "_clone_YfHC",
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
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_JEg9",
        "max": 0,
        "min": 0,
        "name": "mat_monture_label",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_qDGl",
        "max": 0,
        "min": 0,
        "name": "mat_branche_label",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_jH0a",
        "max": 0,
        "min": 0,
        "name": "color_monture_label",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_taPx",
        "max": 0,
        "min": 0,
        "name": "color_branche_label",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "convertURLs": false,
        "hidden": false,
        "id": "_clone_nM0D",
        "maxSize": 0,
        "name": "code_svg",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "editor"
      },
      {
        "hidden": false,
        "id": "_clone_f8hC",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_3475184742",
    "indexes": [],
    "listRule": null,
    "name": "v_lunettes_expand",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT\n  L.id,\n  L.id_utilisateur,\n  L.largeur_pont_mm,\n  L.taille_verre_mm,\n  MM.libelle     AS mat_monture_label,\n  MB.libelle     AS mat_branche_label,\n  CM.nom_couleur AS color_monture_label,\n  CB.nom_couleur AS color_branche_label,\n  L.code_svg,\n  L.created\nFROM Lunette L\nLEFT JOIN Materiaux MM ON L.materiaux_monture = MM.id\nLEFT JOIN Materiaux MB ON L.materiaux_branche = MB.id\nLEFT JOIN Couleur   CM ON L.couleur_monture   = CM.id\nLEFT JOIN Couleur   CB ON L.couleur_branche   = CB.id;\n",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3475184742");

  return app.delete(collection);
})

/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3690071135")

  // update field
  collection.fields.addAt(7, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1897857566",
    "hidden": false,
    "id": "relation401660418",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "materiaux_monture",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1897857566",
    "hidden": false,
    "id": "relation2031361510",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "materiaux_branche",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(9, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1659093395",
    "hidden": false,
    "id": "relation4257530462",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "couleur_monture",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(10, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1659093395",
    "hidden": false,
    "id": "relation3801099925",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "couleur_branche",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3690071135")

  // update field
  collection.fields.addAt(7, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1897857566",
    "hidden": false,
    "id": "relation401660418",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "id_materiaux",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1897857566",
    "hidden": false,
    "id": "relation2031361510",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "id_materiaux_1",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(9, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1659093395",
    "hidden": false,
    "id": "relation4257530462",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "id_couleur_1",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(10, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1659093395",
    "hidden": false,
    "id": "relation3801099925",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "id_couleur",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})

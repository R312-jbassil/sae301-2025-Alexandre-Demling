/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3690071135")

  // add field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1802620688",
    "hidden": false,
    "id": "relation84848196",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "id_utilisateur",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
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

  // add field
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

  // add field
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

  // add field
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
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3690071135")

  // remove field
  collection.fields.removeById("relation84848196")

  // remove field
  collection.fields.removeById("relation401660418")

  // remove field
  collection.fields.removeById("relation2031361510")

  // remove field
  collection.fields.removeById("relation4257530462")

  // remove field
  collection.fields.removeById("relation3801099925")

  return app.save(collection)
})

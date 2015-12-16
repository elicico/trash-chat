Parse.Cloud.beforeSave("Room", function(request, response) {
  var name = request.object.get("name").trim();
  var nameLowercase = name.toLowerCase();

  request.object.set("name", name);
  request.object.set("nameLowercase", nameLowercase);

  if (request.object.get("name").length === 0) {
    response.error("name must be present");
    return;
  }

  var query = new Parse.Query("Room");
  query.equalTo("nameLowercase", nameLowercase);
  query.find().then(
    function(rooms) {
      if (rooms.length > 0) {
        response.error("duplicate name");
      } else {
        response.success();
      }
    },
    function(error) {
      response.error("pokedrama");
    }
  );
});

Parse.Cloud.beforeSave("Message", function(request, response) {
  if (request.object.get("message").trim().length === 0) {
    response.error("empty messages, youuu wwwish");
  } else {
    response.success();
  }
})

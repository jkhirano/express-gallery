exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("photos")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("photos").insert([
        {
          title: "Mountain Hill Cabin Winter",
          link: "- www.fantasticnorway.no",
          image:
            "http://www.dessign.net/architekttheme/wp-content/uploads/Mountain_Hill_Cabin1-logo.jpg",
          description:
            "The project is a winter cabin to be built in a highly restricted area in the mountain landscape of Ål in Norway. The cabin is designed as a landscape element that leads wind and snow around and over the building. One of the client’s initial wishes was to be able to actually go skiing, sledge riding and picnicking on top of the cabin. The cabin is to be erected during late summer 2012. Copyright www.fantasticnorway.no"
        },
        {
          title: "Bronnoy Kunstbase",
          link: "- www.fantasticnorway.no",
          image:
            "http://www.dessign.net/architekttheme/wp-content/uploads/Base-of-Bronnoysund-logo.jpg",
          description:
            "Rhe Art Base of Brønnøysund is a project initiated in collaboration with local artist Vibeke Steinsholm. The ambition of the building was to create a regional forum for contemporary art in South Helgeland. The building is 450 m2 and contains spaces for art production, exhibitions and teaching. Fantastic Norway worked both with the mobilization process of the local inhabitants and politicians, founding and design for a period of five years. The final drawings were done in colaboration with KIMA AS. The Art Base is funded by the Norwegian Cultural Council and local contributors and are intended listed on Brønnøysunds oldest public space. Copyright  www.fantasticnorway.no"
        },
        {
          title: "Kneisen Visitors Center",
          link: "- www.fantasticnorway.no",
          image:
            "http://www.dessign.net/architekttheme/wp-content/uploads/keinser-logo.jpg",
          description:
            "Kneisen is a dual purpose visitors center at the Black Glaciar in northern Norway. The building works both as a centre for eco-tourism and research on new environmentally friendly technology. The building’s design is inspired by the rock glacier has brought with him and left in strange places in the landscape, when the ice finally melted. The building was designed on behalf of the Environmental Energy Nordland AS. Copyright www.fantasticnorway.no"
        }
      ]);
    });
};

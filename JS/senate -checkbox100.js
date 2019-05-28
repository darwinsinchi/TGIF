var app = new Vue({
  el: "#vue-app",
  data: {
    senateMembers: [],
    parties: [],
    states: "ALL"
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo: function() {
      var congress;
      if (window.location.href.includes("senate")) {
        congress = "senate";
      } else {
        congress = "house";
      }
      fetch(
        "https://api.propublica.org/congress/v1/113/" +
          congress +
          "/members.json",
        {
          method: "GET",
          headers: {
            "X-API-KEY": "UtUCd2v2fjbIMNqQxZaAeVS407ZAVVT9iKsCJO6r"
          }
        }
      )
        .then(function(response) {
          var overlay = document.getElementById("overlay");
          overlay.style.display = "none";
          console.log(response);
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then(function(json) {
          console.log(json);
          app.senateMembers = json.results[0].members;
        })
        .catch(function(error) {
          console.log("Request failed:" + error.message);
        });
    }
  },
  computed: {
    filteredMembers: function() {
      var rdifilter = [];
      rdifilter = this.senateMembers.filter(senateMembers => {
        return (
          this.parties.includes(senateMembers.party) || this.parties.length == 0
        );
      });
      var pickState = [];
      pickState = rdifilter.filter(senateMembers => {
        return this.states === senateMembers.state || this.states === "ALL";
      });
      return pickState;
    },
    uniqueStates: function() {
      var removeDuplicates = [];
      for (var i = 0; i < this.senateMembers.length; i++) {
        if (removeDuplicates.indexOf(this.senateMembers[i].state) === -1) {
          removeDuplicates.push(this.senateMembers[i].state);
        }
      }
      console.log(removeDuplicates);
      return removeDuplicates.sort();
    }
  }
});

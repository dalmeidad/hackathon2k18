App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,
  myRole:null,
  candidatesSelect:null,
  candidatesCheck:null,
  companySelect:null,
  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();
      console.log("contracts")
      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");
    var companyContent = $("#company");
    var HRContent = $("#HR")
    var candidateContent = $("#candidate")
    var add = $("#add")
    loader.show();
    add.hide()
    companyContent.hide();
    content.hide();
    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        var myName;
        loader.hide()
        App.contracts.Election.deployed().then(function(instance) {
          instance.registerList(App.account).then(function(role){
            myRole = role
            $("#accountAddress").html("Your Account: " + account+ " Role is "+ myRole);
          })
        })
      }
    });
    if (App.account)
    // Load contract data
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();
      candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();
      candidatesCheck= $('#candidatesCheck');
      candidatesCheck.empty();
      companySelect = $('#companySelect');
      companySelect.empty();
      companiesCount = electionInstance.companiesCount();
      HRCount = electionInstance.HRCount();
      return electionInstance.candidatesCount();
}).then(function(candidatesCount) {
  
      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidateList(i).then(function(candidate) {
          var id = i-1;
          var name = candidate[1];
          var country = candidate[2];
          console.log(i);
          // Render candidate Result
          //var candidatesSelect = $('#candidatesSelect');
          //candidatesSelect.empty();
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + country + "</td></tr>";
          candidatesResults.append(candidateTemplate);
          console.log(candidatesSelect.size)
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>";
          candidatesSelect.append(candidateOption);
          candidatesCheck.append(candidateOption);
          console.log(candidatesSelect);
        });
      }
      return electionInstance.companiesCount();
}).then(function(companiesCount) {
      for (var j = 1; j <= companiesCount; j++) {
        // console.log(j);
        electionInstance.companyList(j).then(function(candidate) {
          var id = j;
          var name = candidate[1];
          var country = candidate[2];
          // Render candidate Result
          var candidateTemplate = "<tr><th> company" + id + "</th><td>" + name + "</td><td>" + country + "</td></tr>";
          candidatesResults.append(candidateTemplate);
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>";
          companySelect.append(candidateOption);
        });
      }
      return electionInstance.HRCount();
}).then(function(HRCount) {
        for (var k = 1; k <= HRCount; k++) {
        electionInstance.HRList(k).then(function(candidate) {
          var id = k;
          var name = candidate[1];
          var country = candidate[2];
          // console.log(k)
          var candidateTemplate = "<tr><th> HR" + id + "</th><td>" + name + "</td><td>" + country + "</td></tr>"
          candidatesResults.append(candidateTemplate);
        });
      }
    }).then(function(registered) {
      if (myRole== 'Company'){
        console.log(myRole);
          companyContent.show();
          candidateContent.hide()
          HRContent.hide();
          $("#accountAddress").html("Your Account is " + App.account+ ", Your role is "+ myRole);
      }
      if (myRole== 'HR'){
        console.log(myRole);
          companyContent.hide();
          candidateContent.hide();
          HRContent.show();
          $("#accountAddress").html("Your Account is " + App.account + ", Your role is "+ myRole);
      }
      if (myRole== 'Candidate'){
        console.log(myRole);
          companyContent.hide();
          HRContent.hide();
          electionInstance.candidates(App.account).then(function(me){
          $("#accountAddress").html("Hello! " + me[1]+ ", Your role is "+ myRole);

          });
      }
    }).catch(function(error) {
      console.warn(error);
    });

  },
  verify: function() {
    var electionInstance;
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      console.log(name);
      instance.verify(candidateId);
    }).then(function(i) {
      // Wait for votes to update
      // var candidateTemplate = "<tr><th>" + App.account  + "</th><td>" + name + "</td><td>" + [] + "</td></tr>"
      // candidatesResults.append(candidateTemplate);
      // $("#content").hide();
      // $("#loader").show();
      console.log(App.account);
      console.log(electionInstance.candidates(App.account));
      //App.render();
    }).catch(function(err) {
      console.error(err);
    });
  },
  check: function() {
    var electionInstance;
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      console.log(name);
      instance.check(candidateId);
    }).then(function(i) {
      // Wait for votes to update
      // var candidateTemplate = "<tr><th>" + App.account  + "</th><td>" + name + "</td><td>" + [] + "</td></tr>"
      // candidatesResults.append(candidateTemplate);
      // $("#content").hide();
      // $("#loader").show();
      console.log(App.account);
      App.render();
    }).catch(function(err) {
      console.error(err);
    });
  },
    rate: function() {
    var electionInstance;
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      instance.Rate(candidateId);
    }).then(function(i) {
      // Wait for votes to update
      // var candidateTemplate = "<tr><th>" + App.account  + "</th><td>" + name + "</td><td>" + [] + "</td></tr>"
      // candidatesResults.append(candidateTemplate);
      // $("#content").hide();
      // $("#loader").show();
      //App.render();
    }).catch(function(err) {
      console.error(err);
    });
  },
addCandidate: function() {
    var electionInstance;
    var name = $('#candidatesName').val();
    App.contracts.Election.deployed().then(function(instance) {
      console.log(name);
      electionInstance = instance;
      electionInstance.addCandidate(name,"USA",{ from: App.account })
      electionInstance.candidates(App.account);
    }).then(function(i) {
      // Wait for votes to update
      // var candidateTemplate = "<tr><th>" + App.account  + "</th><td>" + name + "</td><td>" + [] + "</td></tr>"
      // candidatesResults.append(candidateTemplate);
      // $("#content").hide();
      // $("#loader").show();
      console.log(App.account);
      console.log(electionInstance.candidates(App.account));
      //App.render();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

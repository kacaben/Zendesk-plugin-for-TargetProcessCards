
var organization_fullname;
var organization_name;
var webhookBug;
var webhookReq;
var agent;
var agentMapping;
var projectList = "";
var projectTeamMapping;

$(function() {
	var client = ZAFClient.init();
	client.invoke('resize', { width: '100%', height: '280px' });

	client.metadata().then(
		function(metadata) {
			webhookBug = metadata.settings.webhookBug;
			webhookReq = metadata.settings.webhookReq;
			agentMapping = metadata.settings.agentMapping;
			projectMapping = metadata.settings.projectMapping;
			projectTeamMapping = metadata.settings.projectTeamMapping;
		}
	);

	client.get('currentUser').then(
		function(data) {
			getAgent(data);
		},
		function(response) {
			getAgentError(response);
		}
	);

	client.get('ticket').then(
		function(data) {
			showInfo(data);
		},
		function(response) {
			getError(response);
		}
	);
});


function showInfo(data) {
	orgName(data);
	getOwnerId();
	getProjectId();

  var requester_data = {
	'ticket_id': data.ticket.id,
	'organization_name': organization_name,
	'agent': ownerID,
	'teams': projectTeamMapping,
	'webhookBug': webhookBug,
	'webhookReq': webhookReq,
	'subject':  data.ticket.subject
  };
  var source = $("#requester-template").html();
  var template = Handlebars.compile(source);

	if (ownerID) {
  	var html = template(requester_data);
	}
	else {
		var html = "Agent is not mapped to Targetprocess Owner."
	}

  $("#content").html(html);
	document.getElementById('Project').innerHTML = projectList;
};

// some orgs have id:name some have only name, emty org will be "Customer"
function orgName(data){
	if (data.ticket.organization) {
		organization_fullname = data.ticket.organization.name;
		if (organization_fullname.includes(":")){
			var res = organization_fullname.split(": ");
			var organization_id = res[0];
			organization_name = res[1];
		} else {
		organization_name = organization_fullname;
		}
	} else {
		organization_name = "Customer";
	}
};

function getAgent(data){
	agent = data.currentUser.name;
};

// map agent to TP Owner ID
function getOwnerId(){
	agentMappingJson = JSON.parse(agentMapping);
	ownerID = agentMappingJson[agent];
};

// droplist for Project
function getProjectId(){
	projectMappingJson = JSON.parse(projectMapping);
	Object.keys(projectMappingJson).forEach(function(key) {
	projectList+= "<option value = '"+ projectMappingJson[key] + "'>" + key + "</option>";
	});
};

function getError(response) {
		error_data = {
		'status': response.status,
		'statusText': response.statusText,
	};
	showError(response);
};

function showError(response) {
  var source = $("#error-template").html();
  var template = Handlebars.compile(source);
  var html = template(error_data);
  $("#content").html(html);
}

# App name:
Create Targetprocess tickets from Zendesk

## Author:
Katerina Benova

## Description

Information needed for creating TP ticket is prefilled in the form and sent to Targetprocess webhook in Automation rules.
Agents are mapped to TP Owners (new agents must be added manually into apps install settings)

Another automation rule checks every newly created ticket and if the Zendesk ID is present, webhook is sent to Zapier.
Zapier uses admin's account to update the Zendesk ticket with the TP ticket ID and a comment.

Setting in the Target process:
Automation rule in Target process:
1. create bug ticket:
// Gets web hook from Zendesk App and creates a bug
// Second part of this rule is "Bug /Request created from Zendesk sends TP id back to Zendesk"


const teamMappingJson = JSON.parse(args.body.teams);
const project = args.body.project;
const team = teamMappingJson[args.body.project];

return {
  command: "targetprocess:CreateResource",
  payload: {
    resourceType: "Bug",
    fields: {
      Name: args.body.title,
      Owner: {Id: args.body.owner},
      Project: { Id: args.body.project },
      Team: { Id: teamMappingJson[args.body.project] },
      Severity: { Id: args.body.severity},
      Zendesk: args.body.zd_ticket_id,
      Tags: args.body.tags,
      "Needs Docs Update": args.body["Needs Doc Update"],
      "Customer needs informing": args.body["Customer needs informing"],
      "Release notes": args.body["Release notes"],
      "organization name": args.body["organization name"]
    }
  }
};

2. Create Request ticket:
// Gets web hook from Zendesk App and creates a request in "Product Requests" project
// Second part of this rule is "Bug /Request created from Zendesk sends TP id back to Zendesk"

return {
  command: "targetprocess:CreateResource",
  payload: {
    resourceType: "Request",
    fields: {
      Name: args.body.title,
      Owner: { Id: args.body.owner },
      Project: { Id: xxx },
      Zendesk: args.body.zd_ticket_id,
      Tags: args.body.tags,
      "Customer needs informing": args.body["Customer needs informing"],
      "organization name": args.body["organization name"]
    }
  }
};

3. send webhook to zendesk
{
  "TP": "{{Id}}",
  "Zendesk" : "{{Zendesk}}"
}

### Install settings (manifest.json):

Parameter for mapping Agents to Targetprocess OwnerID in format {"Joe Doe":13, "Jane Doe":74,...}
Parameter for TP projects and their IDs {"web":13, "connectors":74,...}
Parameter for TP projects IDs and Team IDs {"13":135, "54":874,...}
Parameters webhookBug and webhookReq URLs

### The following information is displayed:

* Subject - title of TP ticket
* Organization name
* Project (selectable for bugs, product requests are automatically created in "Product requests" project)
* Severity (ignored in Requests)
* Customer Needs Informing
* Release Notes (ignored in Requests)
* Tags

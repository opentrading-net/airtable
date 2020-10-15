# Enterprise Architecture

This [Airtable](airtable.com) base (see [Enterprise Architecture](https://airtable.com/tblPlXmKVtSCiPB03/viwe8hmqwghlo6fqM?blocks=bipvjkAnx3IOSUyYf)) catalogues the application components of a enterprise in terms of applications, interfaces and actors and the interactions between them.

It serves to capture as-is and to-be state and has some reporting and visualisation features to help understand the interactions between the components in the landscape.

The model in the base attempts to capture interactions between applications as a sequence of steps that descibe a scenario. The best way to visualise these interactions is as a [UML Sequence Diagram](https://en.wikipedia.org/wiki/Sequence_diagram) and the tables in the base use approximately the same terminology as UML, e.g. interaction, activity, actor etc. The model is not a direct one-to-one with UML as the [Interface](##Interface) table captures APIs and integration logic (e.g. wait for file and push data to X).

The following sections describe the tables in the base. 

See [Reports](EnterpriseArchitecture-reports.md) for details of reports and visualisations.

See [Synch to iServer](EnterpriseArchitecture-iServer.md) for detail of the process of synchronizing the application architecture between Airtable and [iServer](https://www.orbussoftware.com/iserver/).

## Application
This is a system, application or application component in the landscape. Like most things in the real world there is a grey-area between an application component and integration components used to move data between applications. 

The table implements a hierarchy with each application assigned a root application. E.g. the METhane application is the root and parent application for the "METhane Gas Tool", "METhane FX Tool", "METhane integration components" etc.

Application is akin to 'Physical Application Component' in TOGAF.

Applications are assigned to a [vendor](##Vendor).

## Vendor
A software vendor. In house applications will have vendor METI

## Actor
An [actor](https://en.wikipedia.org/wiki/Actor_(UML)) captures a role played by a user. Actors will take part in [interactions](##Interaction).

## Interface
An interface captures detail of:
* Application Programming Intefaces (API) 
* Integration logic between applications
* Reports
* Data Stores (including file stores)
* Message Queues


Integration logic interfaces will have a source and destintion which can be either a source application or interface or a destination application or interface.

Interfaces capture technical details such as message patterns, process type, technology.

## Interaction
This table captures a 'use case' or data flow between applications for a given business scenario. E.g. the flow of 'webICE gas trades into Endur' is an interaction.

An interaction is specified as a sequence of [activities](##Activity). Interactions are groups by [interaction type](##Interaction Type)

## Interaction Type
A categorisation of an interaction, e.g. trade capture; or market data flow.

## Activity
An activity is a step in an interaction and captures the communication between either an actor and an application or interface or the running of an integration interface.

An activity can also reference a sub-interaction. E.g. 'Queued trades to Endur' is an interaction that is part of many other interactions and an activity in an interaction could include this step as an activity.


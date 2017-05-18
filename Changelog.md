# Change Log 
All notable changes to this project will be documented in this file

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
 - Overall access page in left menu
 - Project Environments!
 - Version deployments/creation
 - Locking environments
 - Framework support

### Changed
 - Projects are created from platforms, not templates
 - Improved Teams pages
 - Improved access permissions and descriptions

### Fixed
 - Bugs with Teams and Access

### Removed
 - Tour
 - Environment Switcher
 - Project Templates

## 4.0.12
### Changed
 - Upgraded ng-formio to 2.18.0
 - Upgraded ng-formio-builder to 2.18.0

## 4.0.11
### Added
 - TableView rendering to all layout components

### Changed
 - Updating the add team button to only be available to the project owner.

### Fixed
 - Fixed an issue with editing teams, where you wouldn't be taken to the team view, but rather the project overview.
 - Fixed issue where the save submission action mapped to another resource would redirect you to the wrong page after
   making a new submission in the portal preview
   
### Changed
 - Upgraded ng-formio to 2.17.0
 - Upgraded ng-formio-builder to 2.17.0

## 4.0.10
### Changed
 - Upgraded ng-formio and ng-formio-builder to 2.16.6

## 4.0.9
### Fixed
 - Fixed issue where updating payment information would clobber the logged in users profile until a relog was performed.

## 4.0.8
### Changed
 - Upgraded ng-formio to 2.16.5 to revert tableview changes.

## 4.0.7
### Fixed
 - Fixed issue where forms saved with the content component would flag the builder as being dirty.

### Changed
 - Upgraded ng-formio to 2.16.4

## 4.0.6
### Reverted
 - Rolled back ngDialog to fix firefox issues.

### Changed
 - Upgraded ng-formio to 2.16.3

## 4.0.5
### Fixed
 - Fixed issue where the resource fields appeared twice on the save submission action configuration page.
 - Fixing issue with the form builder notifications and content component being flagged as modified on load.

### Changed
 - Upgraded ng-formio to 2.15.8
 - Upgraded ng-formio-builder to 2.15.8

## 4.0.3
### Fixed
 - Fix Go to login link on reset password done page.

## 4.0.2
### Changed
 - Updated ngFormBuilder to 2.15.1
 
## 4.0.1
### Changed
 - Removed test that randomly fails.

## 4.0.0
### Fixed
 - Signaturepad no longer supports bower.
 
### Changed
 - Updated ngFormio to 2.15.1
 - Updated ngFormBuilder to 2.15.0

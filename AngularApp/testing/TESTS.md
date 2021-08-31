# E2E Tests

## General
* test that you removed everything out of AppComponent.ngAfterViewInit
* test that if we have loaded the page on mobile, the the desktop animation doesnt appear
## Overlay Sample
* test that the app is at 100vw and 100vh on prod
    * seems to only be happening on edge


## Nav
* test that at the beginning the image animations and the nav pops up as appropriate
* test that you binded to routerLink properly  
* test that when you click on a mobile nav link you get navigation and the navigation disapperas
* test that when you click on a link we navigation appropriately

### Responsive
* tests that when you click on the nav icon, the nav menu toggles
* that on desktop display nav menu disappers, and is not coverning anything
* test that if the app starts on mobile, the intro animation doesnt run


## Blog
* tests that the blogs are loading proeprly 
* test that the desc stays within the bounding box
* make sure we stop request for blogs after the fn finishes
* when the user clicks on a link they get sent to the blog
* everyday the blog articles update with new content or you shuffle the current content

## Events
* everyday the events update with new content or you shuffle the current content
* eventBrite.json should be an array of objects of type
```ts
{
    url:websiteString,
    org:string,
    name:string,
    image:websiteString
}
```
* test that when you click on a panel you get taken to the event brite page
* mabye test when a user hovers they se labs details


## Labs
* test were in the correct format
* when I click on a lab the lab panel appears
    * we have to make sure that the close button appears

### Labs Panel
* test when we click on a panel it opens
* test when click on the close button the panel closes 
* test that that the content gets updated accordingly
* make sure were transition as necessary

## Footer tests
* test that all the links work?

## Integration tests
* python backend  call the test_my_tests endpoint make sure it updates the json properly

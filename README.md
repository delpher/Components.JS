# Components.JS
Is a library that allows you to easily add JavaScript components to your web app.
No matter if it is fully server-side rendering or SPA.

## Quick Start
```
<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <title>Component Sample</title>

    <script src="libs/jquery.js"></script>
    <script src="libs/component-manager.js"></script>

</head>

<body>

    <div data-component="SampleComponent">
        <h3 data-sample-com="header"></h3>
        <p data-sample-com="content"></p>
    </div>

    <script>

        function SampleComponent() {
            var self = this;

            self.onBind = function(element) {
                self.header = element.find("[data-sample-com='header']");
                self.content = element.find("[data-sample-com='content']");
            }

            self.onInit = function () {
                self.header.html('This is component header');
                self.content.html('This is <strong>component</strong> content');
            }
        }

        $(function() {
            window.ComponentManager.loadComponents($(document));
        })

    </script>

</body>

</html>
```

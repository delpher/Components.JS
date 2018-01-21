# Components.JS
Is a library that allows you to easily add custom JavaScript UI components to your web app.

## Quick Start (raw JavaScript)
```HTML
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

## Using with KnockoutJS
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Component.JS with Knockout</title>

    <script src="../bower_components/jquery/dist/jquery.js"></script>
    <script src="../bower_components/knockout/dist/knockout.js"></script>

    <script src="../Content/Scripts/component-manager.js"></script>
    <script src="../Content/Scripts/knockout-component-binder.js"></script>

</head>
<body>

<div data-component="SampleComponent">
    <h3 data-bind="text: title"></h3>
    <p data-bind="html: content"></p>
</div>

<script>
    function SampleComponent() {
        var self = this;

        self.title = ko.observable("This is component header");
        self.content = ko.observable("This is <strong>component</strong> content")
    }

    $(function() {
        window.ComponentManager.loadComponents($(document), KnockoutComponentBinder);
    })

</script>

</body>
</html>
```

## Using with RequireJS

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Component.JS with RequireJS</title>

    <script src="../bower_components/requirejs/require.js"></script>

</head>
<body>

<div data-component="sample.component">
    <h3 data-sample-com="header"></h3>
    <p data-sample-com="content"></p>
</div>

<script>

    requirejs.config({
        paths: {
            "jquery": "../bower_components/jquery/dist/jquery",
            "component-manager": "../Content/Scripts/component-manager"
        }
    });

    define("sample.component", [], function() {
        function SampleComponent() {
            var self = this;

            self.onBind = function(element) {
                self.header = element.find("[data-sample-com='header']");
                self.content = element.find("[data-sample-com='content']");
            };

            self.onInit = function () {
                self.header.html('This is component header');
                self.content.html('This is <strong>component</strong> content');
            }
        }

        return new SampleComponent();
    })

    require(["component-manager"], function (comMgr) {
        comMgr.loadComponents($(document));
    })

</script>

</body>
</html>
```
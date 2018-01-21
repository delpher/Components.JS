(function() {

    function KnockoutComponentBinder() {
        var self = this;

        self.ko.bindingHandlers.stopBinding = {
            init: function() {
                return { controlsDescendantBindings: true };
            }
        };

        self.bind = function(meta) {
            var instance = meta.instance;
            var element = meta.container;
            var childComponents = element.find("[data-component]");

            childComponents.each(function() {
                disableBinding(self.jquery(this));
            });

            self.ko.cleanNode(element[0]);
            self.ko.applyBindings(instance, element[0]);

            childComponents.each(function() {
                enableBinding(self.jquery(this));
            });
        }

        function disableBinding(node) {
            var bindings = node.attr("data-bind");
            node.attr("data-bind-original", bindings);
            node.attr("data-bind", "stopBinding: true");
        }

        function enableBinding(node) {
            var bindings = node.attr("data-bind-original");

            if (bindings !== undefined)
                node.attr("data-bind", bindings);
            else
                node.removeAttr("data-bind");

            node.removeAttr("data-bind-original");
        }

        return self;
    }

    if (typeof (define) !== "undefined") {
        define(["jquery", "knockout"], function(jquery, ko) {
            KnockoutComponentBinder.prototype.jquery = jquery;
            KnockoutComponentBinder.prototype.ko = ko;
            return new KnockoutComponentBinder();
        });
    } else {
        KnockoutComponentBinder.prototype.jquery = $;
        KnockoutComponentBinder.prototype.ko = ko;
        window.KnockoutComponentBinder = new KnockoutComponentBinder();
    }

})();
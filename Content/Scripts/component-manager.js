(function() {
    "use strict";
    var isRequire = (typeof(require) !== "undefined");

    function ComponentManager() {
        var self = this;

        self.components = new Array();
        self.componentBinder = new DummyComponentBinder();

        self.loadComponents = function(target, defaultBinder) {
            self.componentBinder = defaultBinder ? defaultBinder : self.componentBinder;
            return bootstrapComponents(target)
                .then(function(components) {
                    return handleLoadedComponents(components, target);
                });
        }

        function handleLoadedComponents(metas) {
            var components = new Array();

            metas.forEach(function(meta) {
                components.push(meta);
                self.components.push(meta);
                initializeComponent(meta);
            });

            return components;
        }

        function initializeComponent(meta) {
            var onInit = meta.instance.onInit;

            if (typeof (onInit) === "function")
                onInit();
        }

        function bootstrapComponents(target) {
            var selector = "[data-component]";
            var containers = target.find(selector).addBack(selector);
            var loadedComponents = new Array();

            var task = self.jquery.Deferred();

            var promise = self.jquery.when();
            containers.each(function(index, containerElement) {
                promise = promise
                    .then(function() {
                        return bootstrapComponent(self.jquery(containerElement));
                    })
                    .then(function(metadata) {
                        loadedComponents.push(metadata);
                    });
            });

            promise.then(function() { task.resolve(loadedComponents); });

            return task.promise();
        }

        function bootstrapComponent(container) {
            var task = self.jquery.Deferred();

            var meta = {
                name: container.data("component"),
                container: container
            };

            if (isRequire) {
                require([meta.name], function(component) {
                    handleComponentLoaded(component, task, meta);
                });
            } else {
                var component = eval("window." + meta.name);
                handleComponentLoaded(component, task, meta);
            }

            return task.promise();
        }

        function handleComponentLoaded(component, task, meta) {
            var instance = createInstance(component);
            meta.instance = instance;
            bindComponent(meta)
                .done(function() { task.resolve(meta) })
                .fail(function(error) {
                    error.metadata = meta;
                    initFailed(error);
                    task.resolve(meta);
                    console.error(error, "Component initialization failed.");
                });
        }

        function createInstance(component) {
            if (typeof(component) === "function")
                return new component;
            else
                return component;
        }

        function bindComponent(meta) {
            var task = self.jquery.Deferred();
            var bindingEnabled = true;
            var ctx = { preventBinding: function () { bindingEnabled = false; } };

            try {

                if (typeof (meta.instance.onBind) === "function") {
                    meta.instance.onBind(meta.container, ctx);
                }

                if (bindingEnabled) {
                    if (typeof (meta.instance.binder) !== "undefined") {
                        meta.instance.binder.bind(meta);
                    } else {
                        self.componentBinder.bind(meta);
                    }
                }

                task.resolve();
            } catch (ex) {
                task.reject(ex);
            }

            return task.promise();
        }

        function initFailed(error) {
            error.metadata.container.html("Failed to initialize component.");
        }

        return self;
    }

    function DummyComponentBinder() {
        this.bind = function (meta) {}
    }

    if (isRequire) {
        define(["jquery"], function(jquery) {
            ComponentManager.prototype.jquery = jquery;
            return new ComponentManager();
        });
    } else {
        ComponentManager.prototype.jquery = $;
        window.ComponentManager = new ComponentManager();
    }
})();
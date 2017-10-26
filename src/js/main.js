/*
 * bae-search-filters
 * https://github.com/Wirecloud/bae-search-filters-widget
 *
 * Copyright (c) 2016-2017 CoNWeT, Universidad Politécnica de Madrid
 * Licensed under the Apache-2.0 license.
 */

/* globals MashupPlatform, angular */
angular
    .module('widget', ['ngMaterial', 'ngResource'])
    .controller('WidgetCtrl', function ($scope, $resource) {
        "use strict";

        var init = function init() {

            $scope.data = {};

            // Get the default category
            $scope.defaultCat = MashupPlatform.prefs.get('selected_category');

            $scope.filters = {
                catalogue: getCatalogueList(),
                category: getCategoryList(),
                offeringType: [
                    {value: false, title: 'Single'},
                    {value: true, title: 'Bundle'}
                ]
            };

            $scope.$watchCollection('data', function () {
                buildFilters();
            });

            MashupPlatform.prefs.registerCallback(function () {
                $scope.filters.catalogue = getCatalogueList();
                $scope.filters.category = getCategoryList();
            });
        };

        var buildFilters = function buildFilters() {
            // Dont send empty filters data load
            if (Object.keys($scope.data).length > 0) {
                var filters = {};
                filters.isBundle = $scope.data.offeringType;
                filters["catalogue.id"] = $scope.data.catalogueId;
                filters["category.id"] = $scope.data.categoryId;
                $scope.defaultCat = filters["category.id"];

                MashupPlatform.wiring.pushEvent('filters', filters);
            }
        };

        var getCatalogueList = function getCatalogueList() {
            var url = MashupPlatform.prefs.get('server_url') + '/DSProductCatalog/api/catalogManagement/v2/catalog';

            return $resource(url).query({
                lifecycleStatus: 'Launched'
            });
        };

        var getCategoryList = function getCategoryList() {
            var url = MashupPlatform.prefs.get('server_url') + '/DSProductCatalog/api/catalogManagement/v2/category';

            return $resource(url).query({
                lifecycleStatus: 'Launched'
            }, function (categories) {
                // Find the default category ID and select it
                for (var i = 0; i < categories.length; i++) {
                    if (categories[i].name === $scope.defaultCat) {
                        $scope.data.categoryId = categories[i].id;
                        break;
                    }
                }
            });
        };

        init();
    });

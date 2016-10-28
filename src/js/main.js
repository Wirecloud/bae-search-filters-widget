/*
 * bae-search-filters
 * https://github.com/Wirecloud/bae-search-filters-widget
 *
 * Copyright (c) 2016 CoNWeT, Universidad Politécnica de Madrid
 * Licensed under the Apache-2.0 license.
 */

/*global MashupPlatform, angular */
angular
    .module('widget', ['ngMaterial', 'ngResource'])
    .controller('WidgetCtrl', function ($scope, $resource) {
        "use strict";

        var init = function init() {

            $scope.data = {};

            $scope.filters = {
                catalogue: getCatalogueList(),
                category: getCategoryList(),
                macType: [
                    {value: 'wirecloud/widget', title: 'Widget'},
                    {value: 'wirecloud/operator', title: 'Operator'},
                    {value: 'wirecloud/mashup', title: 'Mashup'}
                ],
                offeringType: [
                    {value: 'single', title: 'Single'},
                    {value: 'bundle', title: 'Bundle'}
                ],
                status: [
                    {value: "owned", title: "Owned"},
                    {value: "not owned", title: "Not Owned"},
                    {value: "installed", title: "Installed"},
                    {value: "not installed", title: "Not installed"},
                ]
            };

            $scope.$watchCollection('data', function () {
                MashupPlatform.wiring.pushEvent('filters', JSON.stringify($scope.data));
            });

            MashupPlatform.prefs.registerCallback(function () {
                $scope.filters.catalogue = getCatalogueList();
                $scope.filters.category = getCategoryList();
            });
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
            });
        };

        init();
    });

/*
 * bae-search-filters
 * https://github.com/Wirecloud/bae-search-filters-widget
 *
 * Copyright (c) 2016 CoNWeT, Universidad Politécnica de Madrid
 * Licensed under the Apache-2.0 license.
 */


angular
    .module('widget', ['ngMaterial', 'ngResource'])
    .controller('WidgetCtrl', function ($scope, $resource) {

        $scope.data = {};

        $scope.filters = {
            catalogue: getCatalogueList(),
            category: getCategoryList(),
            macType: [
                {value: 'widget', title: 'Widget'},
                {value: 'operator', title: 'Operator'},
                {value: 'mashup', title: 'Mashup'}
            ],
            offeringType: [
                {value: 'single', title: 'Single'},
                {value: 'bundle', title: 'Bundle'}
            ]
        };

        $scope.$watchCollection('data', function () {
            MashupPlatform.wiring.pushEvent('filters', JSON.stringify($scope.data));
        });

        MashupPlatform.prefs.registerCallback(function () {
            $scope.filters.catalogue = getCatalogueList();
            $scope.filters.category = getCategoryList();
        });

        function getCatalogueList() {
            var url = MashupPlatform.prefs.get('server_url') + '/DSProductCatalog/api/catalogManagement/v2/catalog';

            return $resource(url).query({
                lifecycleStatus: 'Launched'
            });
        }

        function getCategoryList() {
            var url = MashupPlatform.prefs.get('server_url') + '/DSProductCatalog/api/catalogManagement/v2/category';

            return $resource(url).query({
                parentId: '351'
            });
        }
    });

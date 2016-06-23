const app = angular.module('App', []);

app.controller(
  'Ctrl',
  [
    '$scope',
    function (
      $scope
    ) {

      $scope.createdBy = [
        {
          source: { type: 'user', id: '1'},
          target: { type: 'savedView', id: '1'},
          permissionMap: {
            '.': 5
          }
        }
      ];

      $scope.acl = [
        {
          source: { type: 'user', id: '1'},
          target: { type: 'savedView', id: '1'},
          permissionMap: {
            '.': 1
          }
        }
      ];

      $scope.userLevel40 = [
        {
          source: { type: 'user', id: 'kim' },
          target: { type: 'companyAdmin', id: 'kroger'},
          permissionMap: {
            '*': 7
          }
        },
        {
          source: { type: 'companyAdmin', id: 'kroger' },
          target: { type: 'user', id: 'sitePerson' },
          permissionMap: {
            '*': 7
          }
        },
        {
          source: { type: 'user', id: 'sitePerson' },
          target: { type: 'savedView', id: '1' },
          permissionMap: {
            '.': 7
          }
        }
      ];

      $scope.siteSavedView = [
        {
          source: { type: 'site', id: '1'},
          target: { type: 'savedView', id: '1'},
          permissionMap: {
            '.': 1
          }
        }
      ];

      $scope.userSiteSavedView = [
        {
          source: { type: 'user', id: 'notTheCreator'},
          target: { type: 'site', id: '1'},
          permissionMap: {
            '*': 1
          }
        },
        {
          source: { type: 'site', id: '1'},
          target: { type: 'savedView', id: '1'},
          permissionMap: {
            '.': 1
          }
        }
      ];

      $scope.measurableAccess = [
        {
          source: { type: 'savedView', id: '1'},
          target: { type: 'measurable', id: '1'},
          permissionMap: {
            '.': 1
          }
        },
        {
          source: { type: 'savedView', id: '1'},
          target: { type: 'measurable', id: '2'},
          permissionMap: {
            '.': 1
          }
        },
        {
          source: { type: 'savedView', id: '1'},
          target: { type: 'measurable', id: '3'},
          permissionMap: {
            '.': 1
          }
        }
      ];

      $scope.userSiteSavedViewMeasurableAccess = [
        {
          source: { type: 'user', id: 'notTheCreator'},
          target: { type: 'site', id: '1'},
          permissionMap: {
            '*': 1
          }
        },
        {
          source: { type: 'site', id: '1'},
          target: { type: 'savedView', id: '1'},
          permissionMap: {
            '*': 1
          }
        },
        {
          source: { type: 'savedView', id: '1'},
          target: { type: 'measurable', id: '1'},
          permissionMap: {
            '.': 1
          }
        }
      ];

      $scope.keepItSame = [
        {
          source: { type: 'user', id: 'notTheCreator'},
          target: { type: 'site', id: '1'},
          permissionMap: {
            '*': 1
          }
        },
        {
          source: { type: 'site', id: '1'},
          target: { type: 'savedView', id: '1'},
          permissionMap: {
            '*': 1
          }
        }
      ];

      $scope.companySavedView = [
        {
          source: { type: 'user', id: 'notTheCreator'},
          target: { type: 'company', id: 'kroger'},
          permissionMap: {
            '*': 1
          }
        },
        {
          source: { type: 'company', id: 'kroger'},
          target: { type: 'savedView', id: 'companyRollup'},
          permissionMap: {
            '*': 1
          }
        }
      ];

      function translateToCaption(bits) {
        const read = 1 & bits ? 'r' : '-';
        const write = 2 & bits ? 'w' : '-';
        const admin = 4 & bits ? 'a' : '-';

        return read + write + admin;
      }

      function refresh(id, permissions) {
        let instructions = permissions.reduce((agg, permission) => {
          return agg.concat(_.map(permission.permissionMap, (perms, type) => {
            return `${permission.source.type} ${permission.source.id}->${permission.target.type} ${permission.target.id}: ${type}:${translateToCaption(perms)}`;
          }));
        }, []);
        instructions = instructions.join('\n');

        $(`#${id}`).empty();

        Diagram.parse(instructions).drawSVG(id, {theme: 'simple'});
      }


      $scope.siteShare = 'Share with site';
      $scope.shareWithSite = function shareWithSite() {
        if ($scope.siteShare === 'Share with site') {
          $scope.siteShare = 'Oh god! Stop sharing with site!';
        return;
        }
        $scope.siteShare = 'Share with site';
      };

      $scope.refresh = refresh;
    }
  ]
);

app.directive('jsonText', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attr, ngModel) {
      function into(input) {
        console.log(JSON.parse(input));
        return JSON.parse(input);
      }
      function out(data) {
        return JSON.stringify(data, null, 2);
      }
      ngModel.$parsers.push(into);
      ngModel.$formatters.push(out);
    }
  };
});

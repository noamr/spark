const angular_getCamps = function ($http, $scope, supplier_id) {
  const isNew = $("#isNew").val();
  if (isNew === "false") {
    $http.get(`/suppliers/${supplier_id}/camps`).then((res) => {
        $scope.canDelete = true; //TODO check if the user can delete the camp
        $scope.relatedCamps = res.data.camps;
    });
  }
}
const angular_getSupplierById = ($http, $scope, supplier_id) => {
    $http.get(`/suppliers/${supplier_id}`).then((res) => {
        $scope.supplier = res.data.supplier;
    });
}
suppliers_app.controller("supllierShowController", ($scope, $http, $filter) => {
    const supplier_id = document.querySelector('#meta__supplier_id').value;
    angular_getCamps($http, $scope, supplier_id);
    angular_getSupplierById($http, $scope, supplier_id)
    $scope.changeOrderBy = (orderByValue) => {
        $scope.orderCamps = orderByValue;
    }
});
suppliers_app.controller("supllierEditController", ($scope, $http, $filter) => {
    const supplier_id = document.querySelector('#meta__supplier_id').value;
    const lang = document.getElementById('meta__lang').value || 'he';
    angular_getSupplierById($http, $scope, supplier_id)
    if (lang === "he") {
        $scope.status_options = [
            { id: 'carriage', value: 'הובלה' },
            { id: 'other', value: 'אחר' }
        ]
    } else {
        $scope.status_options = [
            { id: 'carriage', value: 'Carriage' },
            { id: 'other', value: 'Other' }
        ]
    }
    $http.get(`/camps_all`).then((res) => {
        $scope.allCamps = res.data.camps;
    });
    $scope.removeCamp = (campId) => {
        $http.delete(`/suppliers/${supplier_id}/camps/${campId}`).then((res) => {
         //TODO check if the user can delete the camp
        });
        $scope.getCamps();
    }
    $scope.getCamps = () => {
        angular_getCamps($http, $scope, supplier_id);
        setTimeout(() => {
            innerHeightChange();
        }, 500)
    }
    $scope.changeOrderBy = (orderByValue) => {
        $scope.orderMembers = orderByValue;
    };
    if (typeof supplier_id !== 'undefined') {
        $scope.current_supplier_id = supplier_id;
        $scope.getCamps();
    }

    $scope.addCamp= () => {
        const supplier_id = $scope.current_supplier_id;
        // Convert display name to id (prevent id shown in autocomplete)
        const add_camp_display_name = $scope.add_camp_display_name;
        const options = [];
        document.querySelectorAll("#campList option").forEach(option => options.push(option.value));
        if (!options.includes(add_camp_display_name)) {
            // Validate correct camp chosen.
            sweetAlert("oops", "Unknown camp chosen", "warning");
            return;
        }
        const camp_id = document.querySelector("#campList option[value='"+add_camp_display_name+"']").dataset.id;
        $http.put(`/suppliers/${supplier_id}/camps/${camp_id}`)
             .then(function (res) {
                // update table with new data
                $scope.getCamps();
                $scope.add_camp_display_name = '';
             }).catch((err) => {
                if (err.data.data.message.indexOf("Duplicate entry")) {
                    sweetAlert("!oops","You are trying to add a camp that already exists", "warning");
                }
                else {
                    sweetAlert("Error!", "Add new camp error: " + err.data.data.message, "error");
                }
        });
    };

}); //end of controller

angular.module("hackaton-stefanini").controller("PerfilListarController", PerfilListarController);
PessoaListarController.$inject = ["$rootScope", "$scope", "$location",
    "$q", '$filter', '$routeParams', 'HackatonStefaniniService'];

function PerfilListarController($rootScope, $scope, $location,
    $q, $filter, $routeParams, HackatonStefaniniService) {
    vm = this;

    vm.qdePorPagina = 5;
    vm.ultimoIndex = 0;
    vm.contador = 0;

    vm.url = "http://localhost:8080/treinamento/api/perfils/";

    vm.init = function () {
        HackatonStefaniniService.listar(vm.url).then(
            function (responsePerfils) {
                if (responsePerfils.data !== undefined)
                    vm.listaPerfils = responsePerfils.data;

                vm.listaPerfilsMostrar = [];
                console.log(vm.listaPerfils);
                var max = vm.listaPerfils.length > vm.qdePorPagina ? vm.qdePorPagina : vm.listaPerfils.length;

                vm.qdePaginacao = new Array(vm.listaPerfils.length % vm.qdePorPagina === 0 ? vm.listaPerfils.length / vm.qdePorPagina : parseInt(vm.listaPerfils.length / vm.qdePorPagina) + 1);
                vm.currentPage = 1;
                for (var count = 0; count < max; count++) {
                    vm.listaPerfilsMostrar.push(vm.listaPerfils[count]);
                    vm.ultimoIndex++;
                }

                vm.listaPerfilsMostrar.sort(function (a, b) {
                    return a.id - b.id;
                });

                
            }
        );
    };

    vm.atualizarPaginanacao = function (index) {

        if (index >= vm.currentPage)
            vm.avancarPaginanacao(index);
        else
            vm.retrocederPaginanacao(index);
    };

    vm.avancarPaginanacao = function (index) {
        
        vm.listaPerfilsMostrar = [];
        vm.currentPage++;

        var idx = angular.copy(vm.ultimoIndex);
        var cont = vm.listaPerfils.length - vm.qdePorPagina;
        for (var count = cont > vm.qdePorPagina ? vm.qdePorPagina : cont; count > 0; count--) {
            vm.listaPerfilsMostrar.push(vm.listaPerfils[idx++]);
            vm.ultimoIndex++;
            vm.contador++;
        }
        vm.listaPerfilsMostrar.sort(function (a, b) {
            return a.id - b.id;
        });
    };

    vm.retrocederPaginanacao = function (index) {
        
        vm.listaPerfilsMostrar = [];

        vm.currentPage--;
        var idx = vm.contador - 1;
        vm.ultimoIndex = idx + 1;
        for (var count = vm.qdePorPagina; count > 0; count--) {
            vm.listaPerfilsMostrar.push(vm.listaPerfils[idx--]);
            vm.contador--;
        }
        vm.listaPerfilsMostrar.sort(function (a, b) {
            return a.id - b.id;
        });
    };

    vm.editar = function (id) {
        if (id !== undefined)
            $location.path("EditarPerfis/" + id);
        else
            $location.path("cadastrarPerfil");
    }

    vm.remover = function (id) {

        var liberaExclusao = true;

        angular.forEach(vm.listaEndereco, function (value, key) {
            if (value.idPessoa === id)
                liberaExclusao = false;
        });

        if (liberaExclusao)
            HackatonStefaniniService.excluir(vm.url + id).then(
                function (response) {
                    vm.init();
                }
            );
        else {
            alert("Pessoa com Endereço vinculado, exclusão não permitida");
        }
    }

    vm.retornarTelaListagem = function () {
        $location.path("listarPerfils");
    }

}

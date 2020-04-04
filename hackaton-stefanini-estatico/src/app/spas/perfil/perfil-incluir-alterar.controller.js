angular.module("hackaton-stefanini").controller("PerfilIncluirAlterarController", PerfilIncluirAlterarController);
PerfilIncluirAlterarController.$inject = [
    "$rootScope",
    "$scope",
    "$location",
    "$q",
    "$filter",
    "$routeParams",
    "HackatonStefaniniService"];

function PerfilIncluirAlterarController(
    $rootScope,
    $scope,
    $location,
    $q,
    $filter,
    $routeParams,
    HackatonStefaniniService) {

    /**ATRIBUTOS DA TELA */
    vm = this;

    vm.perfil = {
        id: null,
        nome: "",
        descricao: "",
        dataHoraInclusao: new Date().toISOString(),
        dataHoraAlteracao: new Date().toISOString()
    };

    vm.urlPerfil = "http://localhost:8080/treinamento/api/perfils/";
    vm.urlPessoa = "http://localhost:8080/treinamento/api/pessoas/";
    vm.isEdicao = false;

    /**METODOS DE INICIALIZACAO */
    vm.init = function () {

        vm.tituloTela = "Cadastrar Perfil";
        vm.acao = "Cadastrar";


        /**Recuperar a lista de perfil */
        vm.listar(vm.urlPerfil).then(
            function (response) {
                if (response !== undefined) {
                    vm.listaPerfil = response;
                    if ($routeParams.idPerfil) {
                        vm.tituloTela = "Editar Perfil";
                        vm.acao = "Editar";
                        vm.isEdicao = true;
                        vm.recuperarObjetoPorIDURL($routeParams.idPerfil, vm.urlPerfil).then(
                            function (perfilRetorno) {
                                if (perfilRetorno !== undefined) {
                                    vm.perfil = perfilRetorno;
                                    vm.dataHoraInclusaoTela = vm.formataDataTela(perfilRetorno.dataHoraInclusao);
                                    
                                    vm.dataHoraAlteracaoTela = vm.formataDataTela(perfilRetorno.dataHoraAlteracao);
                                }
                            }
                        );
                    }
                }
            }
        );
    };

    /**METODOS DE TELA */
    vm.cancelar = function () {
        vm.retornarTelaListagem();
    };

    vm.retornarTelaListagem = function () {
        $location.path("listarPerfis");
    };

    vm.incluir = function () {
        //vm.perfil.dataHoraInclusao = vm.formataDataJava(vm.perfil.dataHoraInclusao);
        //vm.perfil.dataHoraAlteracao = vm.formataDataJava(vm.perfil.dataHoraAlteracao);


        var objetoDados = angular.copy(vm.perfil);

        if (vm.perfil !== null){

            var isNovoPerfil = true;
            
            angular.forEach(objetoDados.perfils, function (value, key) {
                if (value.id === vm.perfil.id) {
                    isNovoPerfil = false;
                }
            });
            
        }
        if (vm.acao == "Cadastrar") {

            vm.salvar(vm.urlPerfil, objetoDados).then(
                function (perfilRetorno) {
  //                  vm.retornarTelaListagem();
                });
        } else if (vm.acao == "Editar") {
            objetoDados.dataHoraAlteracao = new Date().toISOString();
            vm.alterar(vm.urlPerfil, objetoDados).then(
                function (perfilRetorno) {
                    vm.retornarTelaListagem();
                });
            }
            
            };
    vm.remover = function (objeto, tipo) {

        var url = vm.urlPerfil + objeto.id;
        vm.excluir(url).then(
            function (objetoRetorno) {
                vm.retornarTelaListagem();
            });
    };

    /**METODOS DE SERVICO */
    vm.recuperarObjetoPorIDURL = function (id, url) {

        var deferred = $q.defer();
        HackatonStefaniniService.listarId(url + id).then(
            function (response) {
                if (response.data !== undefined)
                    deferred.resolve(response.data);
            }
        );
        return deferred.promise;
    };

    vm.listar = function (url) {

        var deferred = $q.defer();
        HackatonStefaniniService.listar(url).then(
            function (response) {
                if (response.data !== undefined) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    vm.salvar = function (url, objeto) {

        var deferred = $q.defer();
        var obj = JSON.stringify(objeto);
        console.log(objeto);
        HackatonStefaniniService.incluir(url, obj).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    vm.alterar = function (url, objeto) {

        var deferred = $q.defer();
        var obj = JSON.stringify(objeto);
        HackatonStefaniniService.alterar(url, obj).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    vm.excluir = function (url, objeto) {

        var deferred = $q.defer();
        HackatonStefaniniService.excluir(url).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    /**METODOS AUXILIARES */
    vm.formataDataJava = function (data) {
        var dia = data.slice(0, 2);
        var mes = data.slice(2, 4);
        var ano = data.slice(4, 8);

        return ano + "-" + mes + "-" + dia;
    };

    vm.formataDataTela = function (data) {
        var ano = data.slice(0, 4);
        var mes = data.slice(5, 7);
        var dia = data.slice(8, 10);

        return dia + mes + ano;
    };

    
    
}

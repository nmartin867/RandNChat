m_chat = (function(chat){
    const _this = chat || {};
    _this.goToLogin = () => {
        window.location = '/users/login';
    };

    _this.goToCreate = () => {
        window.location = '/users/create';
    };
    return _this;
})(window.m_chat);
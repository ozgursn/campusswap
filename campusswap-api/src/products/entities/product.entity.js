"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../../users/entities/user.entity"); // Kullanıcı tablosunu import ettik
var Product = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('products')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _campus_decorators;
    var _campus_initializers = [];
    var _campus_extraInitializers = [];
    var _price_decorators;
    var _price_initializers = [];
    var _price_extraInitializers = [];
    var _imageUrl_decorators;
    var _imageUrl_initializers = [];
    var _imageUrl_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _user_decorators;
    var _user_initializers = [];
    var _user_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _isPremium_decorators;
    var _isPremium_initializers = [];
    var _isPremium_extraInitializers = [];
    var _isUrgent_decorators;
    var _isUrgent_initializers = [];
    var _isUrgent_extraInitializers = [];
    var Product = _classThis = /** @class */ (function () {
        function Product_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.title = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.category = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.campus = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _campus_initializers, void 0));
            this.price = (__runInitializers(this, _campus_extraInitializers), __runInitializers(this, _price_initializers, void 0));
            this.imageUrl = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _imageUrl_initializers, void 0));
            this.createdAt = (__runInitializers(this, _imageUrl_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            // product.entity.ts içindeki @ManyToOne ilişkisinin tam doğru yazımı:
            this.user = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _user_initializers, void 0));
            this.userId = (__runInitializers(this, _user_extraInitializers), __runInitializers(this, _userId_initializers, void 0)); // İlişkiyi id bazında yönetmek için kolaylık sağlar
            this.isPremium = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _isPremium_initializers, void 0));
            this.isUrgent = (__runInitializers(this, _isPremium_extraInitializers), __runInitializers(this, _isUrgent_initializers, void 0));
            __runInitializers(this, _isUrgent_extraInitializers);
        }
        return Product_1;
    }());
    __setFunctionName(_classThis, "Product");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _title_decorators = [(0, typeorm_1.Column)()];
        _category_decorators = [(0, typeorm_1.Column)()];
        _campus_decorators = [(0, typeorm_1.Column)()];
        _price_decorators = [(0, typeorm_1.Column)('decimal')];
        _imageUrl_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _user_decorators = [(0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, function (user) { return user.id; }, { onDelete: 'CASCADE' })];
        _userId_decorators = [(0, typeorm_1.Column)()];
        _isPremium_decorators = [(0, typeorm_1.Column)({ default: false })];
        _isUrgent_decorators = [(0, typeorm_1.Column)({ default: false })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _campus_decorators, { kind: "field", name: "campus", static: false, private: false, access: { has: function (obj) { return "campus" in obj; }, get: function (obj) { return obj.campus; }, set: function (obj, value) { obj.campus = value; } }, metadata: _metadata }, _campus_initializers, _campus_extraInitializers);
        __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
        __esDecorate(null, null, _imageUrl_decorators, { kind: "field", name: "imageUrl", static: false, private: false, access: { has: function (obj) { return "imageUrl" in obj; }, get: function (obj) { return obj.imageUrl; }, set: function (obj, value) { obj.imageUrl = value; } }, metadata: _metadata }, _imageUrl_initializers, _imageUrl_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: function (obj) { return "user" in obj; }, get: function (obj) { return obj.user; }, set: function (obj, value) { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _isPremium_decorators, { kind: "field", name: "isPremium", static: false, private: false, access: { has: function (obj) { return "isPremium" in obj; }, get: function (obj) { return obj.isPremium; }, set: function (obj, value) { obj.isPremium = value; } }, metadata: _metadata }, _isPremium_initializers, _isPremium_extraInitializers);
        __esDecorate(null, null, _isUrgent_decorators, { kind: "field", name: "isUrgent", static: false, private: false, access: { has: function (obj) { return "isUrgent" in obj; }, get: function (obj) { return obj.isUrgent; }, set: function (obj, value) { obj.isUrgent = value; } }, metadata: _metadata }, _isUrgent_initializers, _isUrgent_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Product = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Product = _classThis;
}();
exports.Product = Product;

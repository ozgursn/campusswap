"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var multer_1 = require("multer");
var path_1 = require("path");
var ProductsController = function () {
    var _classDecorators = [(0, common_1.Controller)('products')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findAll_decorators;
    var _findByUser_decorators;
    var _findOne_decorators;
    var _remove_decorators;
    var _makePremium_decorators;
    var _makeUrgent_decorators;
    var ProductsController = _classThis = /** @class */ (function () {
        function ProductsController_1(productsService) {
            this.productsService = (__runInitializers(this, _instanceExtraInitializers), productsService);
        }
        // Fotoğraflı Yeni İlan Verme Uç Noktası
        ProductsController_1.prototype.create = function (createProductDto, file) {
            // Eğer kullanıcı bir fotoğraf yüklediyse, bunun internet yolunu veritabanına kaydedelim
            if (file) {
                createProductDto.imageUrl = "http://localhost:3000/uploads/".concat(file.filename);
            }
            return this.productsService.create(createProductDto);
        };
        // 🚨 KİLİT DEĞİŞİKLİK: URL'den gelen query parametrelerini @Query ile yakalıyoruz
        ProductsController_1.prototype.findAll = function (search, category, campus) {
            // Yakaladığımız arama kelimesini, kategori ve kampüsü servisteki canavar filtreye fırlatıyoruz
            return this.productsService.findAll(search, category, campus);
        };
        ProductsController_1.prototype.findByUser = function (userId) {
            return this.productsService.findByUser(userId);
        };
        ProductsController_1.prototype.findOne = function (id) {
            return this.productsService.findOne(id);
        };
        ProductsController_1.prototype.remove = function (id, userId) {
            return this.productsService.remove(id, userId);
        };
        // products.controller.ts dosyasının en alt satırları
        ProductsController_1.prototype.makePremium = function (id) {
            return this.productsService.makePremium(id);
        };
        // 🚀 404 HATASINI ÇÖZEN GÜNCEL METOT:
        // ParseIntPipe ekleyerek gelen ID parametresini güvenli bir sayıya dönüştürüyoruz
        ProductsController_1.prototype.makeUrgent = function (id) {
            return this.productsService.makeUrgent(id);
        };
        return ProductsController_1;
    }());
    __setFunctionName(_classThis, "ProductsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
                storage: (0, multer_1.diskStorage)({
                    destination: './uploads', // Dosyaların kaydedileceği klasör
                    filename: function (req, file, callback) {
                        // Resim isimlerinin çakışmaması için benzersiz bir isim üretiyoruz (Örn: ad-123456.jpg)
                        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                        var ext = (0, path_1.extname)(file.originalname);
                        callback(null, "".concat(file.fieldname, "-").concat(uniqueSuffix).concat(ext));
                    }
                })
            }))];
        _findAll_decorators = [(0, common_1.Get)()];
        _findByUser_decorators = [(0, common_1.Get)('user/:userId')];
        _findOne_decorators = [(0, common_1.Get)(':id')];
        _remove_decorators = [(0, common_1.Delete)(':id')];
        _makePremium_decorators = [(0, common_1.Patch)(':id/premium')];
        _makeUrgent_decorators = [(0, common_1.Patch)(':id/make-urgent')];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByUser_decorators, { kind: "method", name: "findByUser", static: false, private: false, access: { has: function (obj) { return "findByUser" in obj; }, get: function (obj) { return obj.findByUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _makePremium_decorators, { kind: "method", name: "makePremium", static: false, private: false, access: { has: function (obj) { return "makePremium" in obj; }, get: function (obj) { return obj.makePremium; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _makeUrgent_decorators, { kind: "method", name: "makeUrgent", static: false, private: false, access: { has: function (obj) { return "makeUrgent" in obj; }, get: function (obj) { return obj.makeUrgent; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductsController = _classThis;
}(); // Sınıf kapanış parantezi
exports.ProductsController = ProductsController;

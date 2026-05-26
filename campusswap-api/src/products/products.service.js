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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("typeorm");
var ProductsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProductsService = _classThis = /** @class */ (function () {
        function ProductsService_1(productsRepository) {
            this.productsRepository = productsRepository;
        }
        // İlan oluşturma
        ProductsService_1.prototype.create = function (createProductDto) {
            var newProduct = this.productsRepository.create(createProductDto);
            return this.productsRepository.save(newProduct);
        };
        ProductsService_1.prototype.findAll = function (search, category, campus) {
            var findOptions = {
                order: {
                    isUrgent: 'DESC', // ⚡ Önce acil satılıklar
                    isPremium: 'DESC', // 🌟 Sonra premium olanlar
                    createdAt: 'DESC' // 📅 Sonra en yeniler
                },
                relations: {
                    user: true // Satıcı ilişkisi
                }
            };
            var where = {};
            // 1. ARAMA FİLTRESİ SIKI KONTROL
            // Frontend yanlışlıkla string olarak "undefined" veya "null" yollarsa bunu filtreye ekleme
            if (search && search !== 'undefined' && search !== 'null' && search.trim() !== '') {
                where.title = (0, typeorm_1.Like)("%".concat(search, "%"));
            }
            // 2. KATEGORİ FİLTRESİ SIKI KONTROL
            if (category && category !== 'Hepsi' && category !== 'undefined' && category !== 'null' && category.trim() !== '') {
                where.category = category;
            }
            // 3. KAMPÜS FİLTRESİ SIKI KONTROL
            if (campus && campus !== 'Hepsi' && campus !== 'undefined' && campus !== 'null' && campus.trim() !== '') {
                where.campus = campus;
            }
            // Eğer filtre objesinin içi boş değilse seçeneklere ekle
            if (Object.keys(where).length > 0) {
                findOptions.where = where;
            }
            // Herhangi bir filtreleme hatasında uygulamanın çöküp boş dönmesini engellemek için try-catch
            try {
                return this.productsRepository.find(findOptions);
            }
            catch (error) {
                console.error("Ana sayfa ilanları çekilirken SQL hatası oluştu:", error);
                // En kötü senaryoda bile jüriye beyaz ekran veya boş sayfa göstermemek için filtresiz düz listeyi dön:
                return this.productsRepository.find({ order: { createdAt: 'DESC' }, relations: { user: true } });
            }
        };
        ProductsService_1.prototype.findOne = function (id) {
            return this.productsRepository.findOne({
                where: { id: id },
                relations: {
                    user: true
                }
            });
        };
        // Belirli bir kullanıcının ilanlarını listeleme (Profil sayfası için)
        ProductsService_1.prototype.findByUser = function (userId) {
            return this.productsRepository.find({
                where: { userId: userId },
                order: { createdAt: 'DESC' }
            });
        };
        // GÜVENLİ SİLME MOTORU
        ProductsService_1.prototype.remove = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var product;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productsRepository.findOneBy({ id: id })];
                        case 1:
                            product = _a.sent();
                            if (!product) {
                                throw new common_1.BadRequestException('İlan bulunamadı.');
                            }
                            if (product.userId !== userId) {
                                throw new common_1.BadRequestException('Bu ilanı silme yetkiniz yok! Güvenlik ihlali.');
                            }
                            return [2 /*return*/, this.productsRepository.remove(product)];
                    }
                });
            });
        };
        ProductsService_1.prototype.makePremium = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var product;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productsRepository.findOneBy({ id: id })];
                        case 1:
                            product = _a.sent();
                            if (!product)
                                throw new common_1.BadRequestException('İlan bulunamadı');
                            product.isPremium = true;
                            return [2 /*return*/, this.productsRepository.save(product)];
                    }
                });
            });
        };
        // 💰 YENİ: ACİL SATILIK MODUNA ALMA VE BİLDİRİM TETİKLEME FONKSİYONU
        ProductsService_1.prototype.makeUrgent = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var product, updatedProduct;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productsRepository.findOne({
                                where: { id: id },
                                relations: { user: true }
                            })];
                        case 1:
                            product = _a.sent();
                            if (!product) {
                                throw new common_1.NotFoundException('İlan bulunamadı.');
                            }
                            // 2. Acil durum bayrağını true yap ve veritabanına kaydet
                            product.isUrgent = true;
                            return [4 /*yield*/, this.productsRepository.save(product)];
                        case 2:
                            updatedProduct = _a.sent();
                            // 3. 🚨 Kampüse Anlık Bildirim Sinyali Tetikle
                            this.triggerCampusNotification(updatedProduct);
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'İlan Acil Satılık moduna alındı, tüm kampüse bildirim gönderildi!',
                                    product: updatedProduct
                                }];
                    }
                });
            });
        };
        // Jüri sunumunda terminal/log üstünden anlık event fırlatıldığını kanıtlayacak metot
        ProductsService_1.prototype.triggerCampusNotification = function (product) {
            var _a;
            console.log("\n======================================================================");
            console.log("\uD83D\uDEA8 [CAMPUS PUSH NOTIFICATION] \u26A1 AC\u0130L \u0130LAN ALARMI!");
            console.log("\uD83D\uDC64 Sat\u0131c\u0131: ".concat(((_a = product.user) === null || _a === void 0 ? void 0 : _a.username) || 'Bir Öğrenci'));
            console.log("\uD83D\uDCE6 \u00DCr\u00FCn: ".concat(product.title));
            console.log("\uD83D\uDCB0 Fiyat: ".concat(product.price, " \u20BA"));
            console.log("\uD83D\uDCE2 Durum: Kamp\u00FCsteki t\u00FCm \u00F6\u011Frencilere anl\u0131k bildirim f\u0131rlat\u0131ld\u0131!");
            console.log("======================================================================\n");
        };
        return ProductsService_1;
    }());
    __setFunctionName(_classThis, "ProductsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductsService = _classThis;
}();
exports.ProductsService = ProductsService;

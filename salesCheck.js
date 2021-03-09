"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
                        posted: {},
                        not_posted: {},
                        sales_line: "",
                    },
                    updated_by: STORE_ID,
                    updated_on: lastUpdate,
                };
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.LocalDBOptions(), postedQuery, Log_1.saleslog)];
            case 5:
                syncResults = _a.sent();
                Log_1.saleslog.info(syncResults);
                syncResults = syncResults ? syncResults.rows : [];
                syncResults = syncResults.length > 0 ? syncResults : null;
                Log_1.saleslog.info("posted store syncResults: " + JSON.stringify(syncResults));
                entity.posted_store = dataListToEntity(syncResults);
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.StageDBOptions(), postedQuery, Log_1.saleslog)];
            case 8:
                syncResults = _a.sent();
                syncResults = syncResults ? syncResults.rows : [];
                syncResults = syncResults.length > 0 ? syncResults : null;
                Log_1.saleslog.info("posted stage syncResults: " + JSON.stringify(syncResults));
                entity.posted_stage = dataListToEntity(syncResults);
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.LocalDBOptions(), notPostedQuery, Log_1.saleslog)];
            case 9:
                syncResults = _a.sent();
                syncResults = syncResults ? syncResults.rows : [];
                syncResults = syncResults.length > 0 ? syncResults : null;
                Log_1.saleslog.info("notPosted store syncResults: " + JSON.stringify(syncResults));
                entity.not_posted_store = dataListToEntity(syncResults);
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.StageDBOptions(), notPostedQuery, Log_1.saleslog)];
            case 8:
                syncResults = _a.sent();
                syncResults = syncResults ? syncResults.rows : [];
                syncResults = syncResults.length > 0 ? syncResults : null;
                Log_1.saleslog.info("notPosted stage syncResults: " + JSON.stringify(syncResults));
                entity.not_posted_stage = dataListToEntity(syncResults);
                Log_1.saleslog.info("SALE_LINE_QUERY : " + salesLineQuery);
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.LocalDBOptions(), salesLineQuery, Log_1.saleslog)];
            case 9:
                syncResults = _a.sent();
                syncResults = syncResults ? syncResults.rows : [];
                syncResults = syncResults.length > 0 ? syncResults[0] : null;
                Log_1.saleslog.info("SALES_LINES store syncResults: " + JSON.stringify(syncResults));
                if (syncResults) {
                    entity.sales_line_store = syncResults.count;
                }
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.StageDBOptions(), salesLineQuery, Log_1.saleslog)];
            case 10:
                syncResults = _a.sent();
                syncResults = syncResults ? syncResults.rows : [];
                syncResults = syncResults.length > 0 ? syncResults[0] : null;
                Log_1.saleslog.info("SALES_LINES stage syncResults: " + JSON.stringify(syncResults));
                if (syncResults) {
                    entity.sales_line_stage = syncResults.count;
                }
                sqlList = [];
                return [4 /*yield*/, salesValidate(Config.SALES_CHECK.KEYS, entity, lastUpdate, sqlList)];
            case 11:
                _a.sent();
                if (!(entity.sales_line_store != entity.sales_line_stage)) return [3 /*break*/, 13];
                return [4 /*yield*/, salesLineValidate(entity, lastUpdateSalesLine, sqlList)];
            case 12:
                _a.sent();
                _a.label = 13;
            case 13:
                update_query = " UPDATE public.sync_sales_check\n      SET \n      posted_store='" + JSON.stringify(entity.posted_store) + "', \n      posted_stage='" + JSON.stringify(entity.posted_stage) + "', \n      not_posted_store='" + JSON.stringify(entity.not_posted_store) + "', \n      not_posted_stage='" + JSON.stringify(entity.not_posted_stage) + "', \n      sales_line_store= " + entity.sales_line_store + ",\n      sales_line_stage= " + entity.sales_line_stage + ",\n      not_sync_data='" + JSON.stringify(entity.not_sync_data) + "', \n      updated_by='" + STORE_ID + "', \n      updated_on='" + entity.updated_on + "'\n      WHERE id='" + STORE_ID + "'\n      ";
                sqlList.push(update_query);
                Log_1.saleslog.info(sqlList);
                if (!(sqlList && sqlList.length > 0)) return [3 /*break*/, 15];
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.BatchQuery(SyncServiceHelper_1.SyncServiceHelper.StageDBOptions(), sqlList, Log_1.saleslog)];
            case 14:
                _a.sent();
                _a.label = 15;
            case 15: return [3 /*break*/, 17];
            case 16:
                Log_1.saleslog.error("STORE_ID not found in the sync_sales_table");
                _a.label = 17;
            case 17: return [3 /*break*/, 19];
            case 18:
                error_1 = _a.sent();
                Log_1.saleslog.error(error_1);
                return [3 /*break*/, 19];
            case 19:
                Log_1.saleslog.info("***************************** END ***********************************");
                return [2 /*return*/];
        }
    });
}); };
var dataListToEntity = function (list) {
    var item = {};
    var ele = null;
    list = list || [];
    var keys = Config.SALES_CHECK.KEYS;
    keys.forEach(function (val) {
        ele = list.find(function (res) { return res.transkind === val; });
        if (ele) {
            item[val] = ele.count || 0;
        }
        else {
            item[val] = 0;
        }
    });
    return item;
};
var salesLineValidate = function (entity, lastUpdate, sqlList) { return __awaiter(_this, void 0, void 0, function () {
    var backDate, syncReUpdate, syncResults, sql, stageData, storeData, data, syncResultsLocal, _loop_1, _i, data_1, val;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                backDate = App_1.App.DaysBack(new Date(lastUpdate), 100, true).toISOString();
                syncReUpdate = {
                    id: "",
                    store_id: STORE_ID,
                    table_name: "salesline",
                    table_pk: "id",
                    table_pk_value: "",
                    type: "T",
                    sync_date: lastUpdate,
                    add_on: {},
                };
                syncResults = null;
                sql = null;
                stageData = [];
                storeData = [];
                data = [];
                sql = "select  * from salesline  where  inventlocationid = '" + STORE_ID + "' and status in ('POSTED', 'PRINTED')  and lastmodifieddate < '" + lastUpdate + "' and lastmodifieddate >= '" + backDate + "'";
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.StageDBOptions(), sql, Log_1.saleslog)];
            case 1:
                syncResults = _a.sent();
                syncResults = syncResults ? syncResults.rows : [];
                stageData = syncResults.map(function (ele) { return ele["id"]; });
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.LocalDBOptions(), sql, Log_1.saleslog)];
            case 2:
                syncResultsLocal = _a.sent();
                syncResultsLocal = syncResultsLocal ? syncResultsLocal.rows : [];
                storeData = syncResultsLocal.map(function (ele) { return ele["id"]; });
                data = storeData.filter(function (ele) { return stageData.indexOf(ele) < 0; });
                if (!(data && data.length > 0)) return [3 /*break*/, 6];
                entity.sales_line = data.join(",");
                _loop_1 = function (val) {
                    var item, index, obj;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                item = syncResultsLocal.find(function (ele) { return ele.id == val; });
                                sql = SyncServiceHelper_1.SyncServiceHelper.SyncReUpdateSQL("SELECT", syncReUpdate);
                                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.StageDBOptions(), sql, Log_1.saleslog)];
                            case 1:
                                syncResults = _a.sent();
                                syncResults = syncResults ? syncResults.rows : [];
                                index = syncResults.findIndex(function (ele) { return ele.table_pk_value === val; });
                                if (index < 0) {
                                    obj = Object.assign(__assign({}, syncReUpdate), { id: App_1.App.UniqueCode(), table_pk_value: val, add_on: item });
                                    sqlList.push(SyncServiceHelper_1.SyncServiceHelper.SyncReUpdateSQL("INSERT", obj));
                                }
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, data_1 = data;
                _a.label = 3;
            case 3:
                if (!(_i < data_1.length)) return [3 /*break*/, 6];
                val = data_1[_i];
                return [5 /*yield**/, _loop_1(val)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [2 /*return*/];
        }
    });
}); };
var salesValidate = function (keys, entity, lastUpdate, sqlList) { return __awaiter(_this, void 0, void 0, function () {
    var syncReUpdate, syncResults, sql, stageData, storeData, data, backDate, _i, keys_1, ele, syncResultsLocal, _loop_2, _a, data_2, val;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                syncReUpdate = {
                    id: "",
                    store_id: STORE_ID,
                    table_name: "salestable",
                    table_pk: "salesid",
                    table_pk_value: "",
                    type: "T",
                    sync_date: lastUpdate,
                    add_on: {},
                };
                syncResults = null;
                sql = null;
                stageData = [];
                storeData = [];
                data = [];
                backDate = App_1.App.DaysBack(new Date(lastUpdate), 100, true).toISOString();
                _i = 0, keys_1 = keys;
                _b.label = 1;
            case 1:
                if (!(_i < keys_1.length)) return [3 /*break*/, 11];
                ele = keys_1[_i];
                if (!(entity.posted_store[ele] != entity.posted_stage[ele])) return [3 /*break*/, 7];
                Log_1.saleslog.error(STORE_ID +
                    " -> posted " +
                    ele +
                    " (store/stage): " +
                    entity.posted_store[ele] +
                    " / " +
                    entity.posted_stage[ele]);
                sql = "select * from salestable  where syncstatus in (0,2) and inventlocationid = '" + STORE_ID + "' and status in ('POSTED', 'PRINTED') and transkind in ( '" + ele + "') and lastmodifieddate < '" + lastUpdate + "' and lastmodifieddate >= '" + backDate + "' ";
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.StageDBOptions(), sql, Log_1.saleslog)];
            case 2:
                syncResults = _b.sent();
                syncResults = syncResults ? syncResults.rows : [];
                stageData = syncResults.map(function (ele) { return ele["salesid"]; });
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.LocalDBOptions(), sql, Log_1.saleslog)];
            case 3:
                syncResultsLocal = _b.sent();
                syncResultsLocal = syncResultsLocal ? syncResultsLocal.rows : [];
                storeData = syncResultsLocal.map(function (ele) { return ele["salesid"]; });
                data = storeData.filter(function (ele) { return stageData.indexOf(ele) < 0; });
                if (!(data && data.length > 0)) return [3 /*break*/, 7];
                entity.not_sync_data.posted[ele] = data.join(",");
                _loop_2 = function (val) {
                    var item, index, obj;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                item = syncResultsLocal.find(function (ele) { return ele.salesid == val; });
                                sql = SyncServiceHelper_1.SyncServiceHelper.SyncReUpdateSQL("SELECT", syncReUpdate);
                                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.StageDBOptions(), sql, Log_1.saleslog)];
                            case 1:
                                syncResults = _a.sent();
                                syncResults = syncResults ? syncResults.rows : [];
                                index = syncResults.findIndex(function (ele) { return ele.table_pk_value === val; });
                                if (index < 0) {
                                    obj = Object.assign(__assign({}, syncReUpdate), { id: App_1.App.UniqueCode(), table_pk_value: val, add_on: item });
                                    sqlList.push(SyncServiceHelper_1.SyncServiceHelper.SyncReUpdateSQL("INSERT", obj));
                                }
                                return [2 /*return*/];
                        }
                    });
                };
                _a = 0, data_2 = data;
                _b.label = 4;
            case 4:
                if (!(_a < data_2.length)) return [3 /*break*/, 7];
                val = data_2[_a];
                return [5 /*yield**/, _loop_2(val)];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6:
                _a++;
                return [3 /*break*/, 4];
            case 7:
                if (!(entity.not_posted_store[ele] != entity.not_posted_store[ele])) return [3 /*break*/, 10];
                Log_1.saleslog.error(STORE_ID +
                    " -> not_posted " +
                    ele +
                    " (store/stage): " +
                    entity.posted_store[ele] +
                    " / " +
                    entity.posted_stage[ele]);
                sql = "select  * from salestable  where syncstatus in (0,2) and inventlocationid = '" + STORE_ID + "' and status NOT in ('POSTED', 'PRINTED') and transkind in ( '" + ele + "') and lastmodifieddate < '" + lastUpdate + "' and lastmodifieddate >= '" + backDate + "' ";
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.StageDBOptions(), sql, Log_1.saleslog)];
            case 8:
                syncResults = _b.sent();
                syncResults = syncResults ? syncResults.rows : [];
                stageData = syncResults.map(function (ele) { return ele["salesid"]; });
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.LocalDBOptions(), sql, Log_1.saleslog)];
            case 9:
                syncResults = _b.sent();
                syncResults = syncResults ? syncResults.rows : [];
                storeData = syncResults.map(function (ele) { return ele["salesid"]; });
                data = storeData.filter(function (ele) { return stageData.indexOf(ele) < 0; });
                if (data && data.length > 0) {
                    entity.not_sync_data.not_posted[ele] = data.join(",");
                    // data.map((val: any) => {
                    //   let obj = Object.assign(
                    //     { ...syncReUpdate },
                    //     { id: App.UniqueCode(), table_pk_value: val, add_on: { salesid: val } }
                    //   );
                    //   sqlList.push(SyncServiceHelper.SyncReUpdateSQL("INSERT", obj));
                    // });
                }
                _b.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 1];
            case 11: return [2 /*return*/, sqlList];
        }
    });
}); };
var syncRun = function () { return __awaiter(_this, void 0, void 0, function () {
    var syncResults, sql, sqlList, obj, syncReUpdateConst, syncReUpdate, _i, syncResults_1, row, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                syncResults = null;
                sql = null;
                sqlList = [];
                obj = null;
                Log_1.saleslog.info("***************************** syncRun START ***********************************");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 13, , 14]);
                syncReUpdateConst = {
                    id: "",
                    store_id: STORE_ID,
                    table_name: "salestable','salesline",
                    table_pk: "salesid",
                    table_pk_value: "",
                    type: "T",
                    add_on: {},
                };
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.SyncReUpdateSQL("SELECT", syncReUpdateConst)];
            case 2:
                sql = _a.sent();
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.StageDBOptions(), sql, Log_1.saleslog)];
            case 3:
                syncResults = _a.sent();
                syncResults = syncResults ? syncResults.rows : [];
                syncResults = syncResults.length > 0 ? syncResults : null;
                if (!syncResults) return [3 /*break*/, 12];
                syncResults = syncResults.filter(function (ele) { return ele.is_resync == true; });
                Log_1.saleslog.info(JSON.stringify(syncResults));
                syncReUpdate = null;
                _i = 0, syncResults_1 = syncResults;
                _a.label = 4;
            case 4:
                if (!(_i < syncResults_1.length)) return [3 /*break*/, 8];
                row = syncResults_1[_i];
                syncReUpdate = Object.assign(__assign({}, syncReUpdateConst), row);
                return [4 /*yield*/, buildQuery(syncReUpdate, row, sqlList)];
            case 5:
                _a.sent();
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.SyncReUpdateSQL("UPDATE", syncReUpdate)];
            case 6:
                sql = _a.sent();
                if (sql) {
                    sqlList.push(sql);
                }
                _a.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 4];
            case 8:
                if (!(sqlList && sqlList.length > 0)) return [3 /*break*/, 12];
                Log_1.saleslog.info("syncReUpdate.type :" + syncReUpdate.type);
                Log_1.saleslog.info(sqlList);
                if (!(syncReUpdate.type === "T")) return [3 /*break*/, 10];
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.BatchQuery(SyncServiceHelper_1.SyncServiceHelper.StageDBOptions(), sqlList, Log_1.saleslog)];
            case 9:
                _a.sent();
                return [3 /*break*/, 12];
            case 10: return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.BatchQuery(SyncServiceHelper_1.SyncServiceHelper.LocalDBOptions(), sqlList, Log_1.saleslog)];
            case 11:
                _a.sent();
                _a.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                error_2 = _a.sent();
                Log_1.saleslog.error(error_2);
                return [3 /*break*/, 14];
            case 14:
                Log_1.saleslog.info("***************************** syncRun END ***********************************");
                return [2 /*return*/];
        }
    });
}); };
var buildQuery = function (syncReUpdate, dbSyncReUpdate, batchSql) { return __awaiter(_this, void 0, void 0, function () {
    var syncResults, stageData, storeData, sql, syncResultsStage, syncResultsLocal, sync;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                syncResults = null;
                stageData = null;
                storeData = null;
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.BuildDMLSelectPkQuery(syncReUpdate.table_name, syncReUpdate.table_pk, dbSyncReUpdate["table_pk_value"])];
            case 1:
                sql = _a.sent();
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.StageDBOptions(), sql, Log_1.saleslog)];
            case 2:
                syncResultsStage = _a.sent();
                stageData = syncResultsStage ? syncResultsStage.rows : [];
                stageData = stageData.length > 0 ? stageData[0] : null;
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.LocalDBOptions(), sql, Log_1.saleslog)];
            case 3:
                syncResultsLocal = _a.sent();
                storeData = syncResultsLocal ? syncResultsLocal.rows : [];
                storeData = storeData.length > 0 ? storeData[0] : null;
                sync = {
                    map_table: syncReUpdate.table_name,
                    map_pk: syncReUpdate.table_pk,
                };
                if (!(syncReUpdate.type === "T" && storeData)) return [3 /*break*/, 5];
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.BuildBatchQuery(syncResultsLocal, sync, Log_1.saleslog, SyncServiceHelper_1.SyncServiceHelper.StageDBOptions(), batchSql)];
            case 4:
                _a.sent();
                return [3 /*break*/, 8];
            case 5:
                if (!(syncReUpdate.type === "M" && stageData)) return [3 /*break*/, 7];
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.BuildBatchQuery(syncResultsStage, sync, Log_1.saleslog, SyncServiceHelper_1.SyncServiceHelper.LocalDBOptions(), batchSql)];
            case 6:
                _a.sent();
                return [3 /*break*/, 8];
            case 7:
                sql = null;
                _a.label = 8;
            case 8: return [2 /*return*/, sql];
        }
    });
}); };
cron.schedule("* * * * *", function () { return __awaiter(_this, void 0, void 0, function () {
    var error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, checkInternet()];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 4];
                return [4 /*yield*/, main()];
            case 2:
                _a.sent();
                return [4 /*yield*/, syncRun()];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                Log_1.saleslog.warn(">>>>>>>>>>>>>>>>> No Internet connection <<<<<<<<<<<<<<<<<<<<");
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_3 = _a.sent();
                Log_1.saleslog.error(error_3);
                Log_1.saleslog.error("******* Error on sync sales check **********");
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
var checkInternet = function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, dns
                .lookup("google.com")
                .then(function () { return true; })
                .catch(function () { return false; })];
    });
}); };

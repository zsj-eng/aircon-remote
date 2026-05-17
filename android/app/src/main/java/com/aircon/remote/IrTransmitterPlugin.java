package com.aircon.remote;

import android.content.Context;
import android.hardware.ConsumerIrManager;
import android.os.Build;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "IrTransmitter")
public class IrTransmitterPlugin extends Plugin {

    private ConsumerIrManager irManager;

    @Override
    public void load() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            irManager = (ConsumerIrManager) getContext().getSystemService(Context.CONSUMER_IR_SERVICE);
        }
    }

    @PluginMethod
    public void hasIrEmitter(PluginCall call) {
        JSObject result = new JSObject();
        boolean hasIr = irManager != null && irManager.hasIrEmitter();
        result.put("hasIr", hasIr);
        call.resolve(result);
    }

    @PluginMethod
    public void transmit(PluginCall call) {
        if (irManager == null || !irManager.hasIrEmitter()) {
            JSObject errResult = new JSObject();
            errResult.put("success", false);
            errResult.put("message", "设备不支持红外发射功能");
            call.resolve(errResult);
            return;
        }

        try {
            int frequency = call.getInt("frequency", 38000);
            var patternList = call.getArray("pattern");
            if (patternList == null || patternList.length() == 0) {
                JSObject errResult = new JSObject();
                errResult.put("success", false);
                errResult.put("message", "红外信号数据为空");
                call.resolve(errResult);
                return;
            }

            int[] pattern = new int[patternList.length()];
            for (int i = 0; i < patternList.length(); i++) {
                pattern[i] = patternList.getInt(i);
            }

            irManager.transmit(frequency, pattern);

            JSObject result = new JSObject();
            result.put("success", true);
            result.put("message", "红外信号已发射");
            call.resolve(result);
        } catch (Exception e) {
            JSObject errResult = new JSObject();
            errResult.put("success", false);
            errResult.put("message", "发射失败: " + e.getMessage());
            call.resolve(errResult);
        }
    }
}

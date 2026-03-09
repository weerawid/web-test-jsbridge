# JSBridge Tester - Modern UI

แพลตฟอร์มสำหรับทดสอบฟังก์ชัน JavaScript Bridge ด้วยอินเทอร์เฟซสมัยใหม่

## ✨ อะไรที่เปลี่ยนไป

### 1. **Refactored Code**
- แยกโค้ด JavaScript ออกเป็น 3 ไฟล์ (modular)
  - `jsbridge.js` - ฟังก์ชัน JSBridge ทั้งหมด
  - `ui.js` - ฟังก์ชัน UI และ utilities
  - `init.js` - การตั้งค่าเริ่มต้น
- ใช้ comments และ JSDoc สำหรับความชัดเจน
- ลบโค้ดที่ซ้ำกันและไม่ใช้

### 2. **Modern & Beautiful UI**
- ✅ Design ที่สวยงามและเป็นระเบียบ
- ✅ Dark/Light mode support-ready
- ✅ Responsive design (ใช้งานได้บน mobile)
- ✅ Smooth animations และ transitions
- ✅ Better visual hierarchy
- ✅ Icons และ emojis สำหรับความชัดเจน
- ✅ Card-based layout
- ✅ Modern color scheme

### 3. **ฟังก์ชัน openAppRoute ใหม่**
```javascript
openAppRoute()
// Parameters:
// - featureName: ชื่อ feature (เช่น "payment", "settings")
// - screenName: ชื่อ screen (เช่น "checkout", "profile")
```

ตำแหน่งในหน้า: **Deep Links & Routing** card

## 📁 ไฟล์ที่ได้รับ

### Option 1: Modular (แนะนำสำหรับ Project ใหญ่)
```
index.html          - HTML structure
jsbridge.js         - Bridge functions
ui.js               - UI utilities
init.js             - Initialization
```

**วิธีใช้:**
```html
<script src="/scripts/jsbridge.js"></script>
<script src="/scripts/ui.js"></script>
<script src="/scripts/init.js"></script>
```

### Option 2: Standalone (ไฟล์เดียว)
```
index-standalone.html - ไฟล์ HTML เดียว (all-in-one)
```

**วิธีใช้:** เปิดไฟล์เลยได้เลย ไม่ต้องไฟล์อื่น

## 🎯 ลักษณะสำคัญ

### Design Improvements
- **Layout**: Grid system ที่ responsive
- **Colors**: Color palette ที่ชัดเจนและสะดวกต่อสายตา
- **Typography**: Font ที่อ่านง่ายและชัดเจน
- **Spacing**: Consistent spacing ตลอดทั้งหน้า
- **Shadows**: Subtle shadows สำหรับ depth

### New Features
1. **openAppRoute** - ฟังก์ชันใหม่สำหรับการนำทางไปยัง feature/screen
2. **Better Error Handling** - แสดงข้อมูล error อย่างชัดเจน
3. **Modal Improvements** - Modal ที่สวยงามกว่า
4. **Form Validation** - ตรวจสอบข้อมูลก่อนส่ง

### Code Quality
- ✅ Clean code structure
- ✅ Consistent naming conventions
- ✅ JSDoc comments
- ✅ Error handling
- ✅ No code duplication

## 🔌 Bridge Functions

### Media
- `getCameraImage()` - ดึงรูปจากกล้อง
- `getGalleryImage()` - ดึงรูปจากแกลลอรี่
- `saveImageToGallery()` - บันทึกรูปลงแกลลอรี่
- `shareImage()` - แชร์รูป

### Navigation
- `openWebview()` - เปิด webview
- `closeWebview()` - ปิด webview
- `openExternalBrowser()` - เปิด external browser
- `openDeepLink()` - เปิด deep link (external)
- `openInternalDeepLink()` - เปิด deep link (internal)
- `openAppRoute()` - **NEW** - เปิด app route

### Payment & Business
- `openPayment()` - เปิดหน้าชำระเงิน
- `openMicrosite()` - เปิด microsite
- `closeMicrositeWithResult()` - ปิด microsite พร้อมผลลัพธ์
- `openMiniApp()` - เปิด mini app
- `closeMiniAppWithResult()` - ปิด mini app พร้อมผลลัพธ์

### Sharing & Account
- `shareText()` - แชร์ข้อความ
- `copyToClipboard()` - คัดลอกลงคลิปบอร์ด
- `openEmailSetting()` - เปิดตั้งค่าอีเมล
- `openHideUnHideAccount()` - ซ่อน/แสดงบัญชี

### Authentication
- `internalPartnerInitAuth()` - เริ่มต้นการยืนยันตัวตน
- `internalPartnerPinVerify()` - ยืนยัน PIN
- `internalPartnerPinWithFaceScanIfNeeded()` - ยืนยัน PIN + Face Scan

### Analytics
- `internalPartnerGATagging()` - Google Analytics tagging
- `internalPartnerAppsFlyerTagging()` - AppsFlyer tagging

### Custom
- `customJSBridge()` - เรียกใช้ฟังก์ชัน custom
- `testFunction()` - ทดสอบ JSBridge availability

## 🚀 การใช้ openAppRoute

```javascript
function openAppRoute() {
  const featureName = document.getElementById('openAppRouteFeatureName').value;
  const screenName = document.getElementById('openAppRouteScreenName').value;

  if (!featureName || !screenName) {
    showModal('Please fill in Feature Name and Screen Name', 'warning');
    return;
  }

  sendBridge('openAppRoute', [
    { key: 'featureName', value: featureName },
    { key: 'screenName', value: screenName },
  ]);

  if (window.bridge) {
    window.bridge.openAppRouteCallback = (result) => {
      showModal(`App Route opened: ${result}`, 'success');
    };
    window.bridge.openAppRouteCallbackError = (errorCode, errorDescription) => {
      showModal(
        `App Route Error: ${errorCode}\n${errorDescription}`,
        'error'
      );
    };
  }
}
```

### Example Usage
```
Feature Name: payment
Screen Name: checkout

// จะเรียก: JSBridge.openAppRoute('payment', 'checkout')
```

## 📱 Responsive Design

| Device | Status |
|--------|--------|
| Desktop | ✅ Full featured |
| Tablet | ✅ Optimized |
| Mobile | ✅ Optimized |

## 🎨 Color Scheme

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#1e88e5` | Buttons, links |
| Primary Dark | `#1565c0` | Hover states |
| Primary Light | `#e3f2fd` | Backgrounds |
| Gray | Various | Text, borders |
| Success | `#43a047` | Success messages |
| Danger | `#e53935` | Error messages |
| Warning | `#fb8c00` | Warning messages |

## 💡 Tips

1. **Session Storage**: ข้อมูล weblinks, deeplinks, และ microsite settings จะบันทึกอัตโนมัติ
2. **Custom Parameters**: ใช้ "Custom Functions" section เพื่อสร้างฟังก์ชัน custom
3. **Image Preview**: คลิกปุ่มและเลือกรูป image option ที่ต้องการ
4. **JSON Editor**: สำหรับ GA และ AppsFlyer tagging, ใช้ JSON format

## 🔄 Migration จากเดิม

หากคุณใช้ HTML เดิม ให้:

1. **แทน**: ใช้ `index-standalone.html` (ไฟล์เดียว)
   - ไม่ต้องเปลี่ยนโค้ด native
   - เพียงแค่เปลี่ยนไฟล์ HTML

2. **หรือ**: ใช้ modular structure (ไฟล์แยก)
   - ดีกว่าสำหรับ project ใหญ่
   - ยืดหยุ่นในการปรับเปลี่ยน

## 📝 Browser Support

- ✅ Chrome/Chromium
- ✅ Safari
- ✅ Firefox
- ✅ Edge

## ❓ FAQ

**Q: openAppRoute ต้องทำอะไรที่ native side?**
A: เพิ่มฟังก์ชัน `openAppRoute(featureName, screenName)` ใน JSBridge ของคุณ

**Q: สามารถปรับเปลี่ยน colors ได้ไหม?**
A: ได้ ดูที่ `:root` CSS variables ที่ด้านบนของไฟล์ CSS

**Q: ข้อมูลจะเก็บไว้ที่ไหน?**
A: ใช้ sessionStorage ซึ่งจะลบอัตโนมัติเมื่อปิด browser

**Q: สามารถเพิ่มฟังก์ชันได้ไหม?**
A: ได้ เพิ่มในส่วน custom functions หรือแก้ไขไฟล์ jsbridge.js

## 📧 Support

หากมีปัญหา:
1. ตรวจสอบ browser console (F12)
2. ตรวจสอบว่า JSBridge available
3. ดูที่ error message ใน modal

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready ✅

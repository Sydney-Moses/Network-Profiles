# Network-Profiles

网络分流规则资源整理与 MRS 格式转换。

本仓库主要提供两类规则资源：

- `Rules/`：YAML 格式规则
- `MRS/`：Mihomo MRS 格式规则

本仓库中的规则需要按照对应的 YAML 与 MRS 文件进行组合使用。

# 一、规则来源

本仓库使用的主要规则来源：

**blackmatrix7/ios_rule_script**

上游项目：

https://github.com/blackmatrix7/ios_rule_script

规则目录：

https://github.com/blackmatrix7/ios_rule_script/tree/master/rule

本仓库目前包含以下规则：
- ChinaMax
- Advertising
- AdvertisingLite
- Privacy
- Apple
本仓库不是上述项目的官方仓库。
第三方规则的原始内容、作者署名、数据来源、许可证及其他相关权利，以相应上游项目及相关权利人的当前说明为准。

本仓库主要进行：

- 规则同步
- 规则整理
- MRS 格式转换

# 二、仓库目录

```text
Network-Profiles/
├── MRS/
│   ├── Advertising_Domain.mrs
│   ├── AdvertisingLite_Domain.mrs
│   ├── Apple_Domain.mrs
│   ├── ChinaMax_Domain.mrs
│   ├── ChinaMax_IP.mrs
│   └── Privacy_Domain.mrs
│
├── Rules/
│   ├── Advertising.yaml
│   ├── AdvertisingLite.yaml
│   ├── Apple.yaml
│   ├── ChinaMax.yaml
│   └── Privacy.yaml
│
└── README.md
````

---

# 三、规则组合方式

本仓库中的规则需要按照下面的方式组合使用。

请不要只添加 YAML 或只添加 MRS。

---
⚠️ 注意！
AdvertisingLite 是 Advertising 规则的精简版。

也就是说：
Advertising
├── Rules/Advertising.yaml
└── MRS/Advertising_Domain.mrs

        ↓ 精简版

AdvertisingLite
├── Rules/AdvertisingLite.yaml
└── MRS/AdvertisingLite_Domain.mrs
```
`AdvertisingLite` 与 `Advertising` 存在规则重叠。

因此：

**不要同时使用 Advertising 和 AdvertisingLite。**

二者选择其中一套即可：

如果已经使用：
Rules/Advertising.yaml
MRS/Advertising_Domain.mrs
❌ 不要再添加：
Rules/AdvertisingLite.yaml
MRS/AdvertisingLite_Domain.mrs
反之亦然。

✅ 正确组合如下：

## 1. ChinaMax

ChinaMax 需要同时使用：

```text
Rules/ChinaMax.yaml
MRS/ChinaMax_Domain.mrs
MRS/ChinaMax_IP.mrs
```

完整组合：

```text
ChinaMax
├── Rules/ChinaMax.yaml
├── MRS/ChinaMax_Domain.mrs
└── MRS/ChinaMax_IP.mrs
```

其中：

```text
Rules/ChinaMax.yaml
+
MRS/ChinaMax_Domain.mrs
+
MRS/ChinaMax_IP.mrs
```

三个文件需要全部加入配置。

---

## 2. Advertising

Advertising 需要同时使用：

```text
Rules/Advertising.yaml
MRS/Advertising_Domain.mrs
```

完整组合：

```text
Advertising
├── Rules/Advertising.yaml
└── MRS/Advertising_Domain.mrs
```

两个文件需要全部加入配置。

---

## 3. AdvertisingLite

AdvertisingLite 需要同时使用：

```text
Rules/AdvertisingLite.yaml
MRS/AdvertisingLite_Domain.mrs
```

完整组合：

```text
AdvertisingLite
├── Rules/AdvertisingLite.yaml
└── MRS/AdvertisingLite_Domain.mrs
```

两个文件需要全部加入配置。

---

## 4. Privacy

Privacy 需要同时使用：

```text
Rules/Privacy.yaml
MRS/Privacy_Domain.mrs
```

完整组合：

```text
Privacy
├── Rules/Privacy.yaml
└── MRS/Privacy_Domain.mrs
```

两个文件需要全部加入配置。

---

## 5. Apple

Apple 需要同时使用：

```text
Rules/Apple.yaml
MRS/Apple_Domain.mrs
```

完整组合：

```text
Apple
├── Rules/Apple.yaml
└── MRS/Apple_Domain.mrs
```

两个文件需要全部加入配置。

---

# 四、完整组合清单

为了方便直接配置，本仓库目前的规则组合如下：

```text
ChinaMax
├── Rules/ChinaMax.yaml
├── MRS/ChinaMax_Domain.mrs
└── MRS/ChinaMax_IP.mrs


Advertising
├── Rules/Advertising.yaml
└── MRS/Advertising_Domain.mrs


AdvertisingLite
├── Rules/AdvertisingLite.yaml
└── MRS/AdvertisingLite_Domain.mrs


Privacy
├── Rules/Privacy.yaml
└── MRS/Privacy_Domain.mrs


Apple
├── Rules/Apple.yaml
└── MRS/Apple_Domain.mrs
```

---

# 五、规则配置

将同一规则对应的文件加入客户端后，应将它们指向相同的策略。

例如 Advertising：

```text
Rules/Advertising.yaml
        ↓
Advertising
        ↓
REJECT

MRS/Advertising_Domain.mrs
        ↓
Advertising-Domain
        ↓
REJECT
```

AdvertisingLite：

```text
Rules/AdvertisingLite.yaml
        ↓
AdvertisingLite
        ↓
REJECT

MRS/AdvertisingLite_Domain.mrs
        ↓
AdvertisingLite-Domain
        ↓
REJECT
```

Privacy：

```text
Rules/Privacy.yaml
        ↓
Privacy
        ↓
REJECT

MRS/Privacy_Domain.mrs
        ↓
Privacy-Domain
        ↓
REJECT
```

ChinaMax：

```text
Rules/ChinaMax.yaml
        ↓
ChinaMax
        ↓
DIRECT

MRS/ChinaMax_Domain.mrs
        ↓
ChinaMax-Domain
        ↓
DIRECT

MRS/ChinaMax_IP.mrs
        ↓
ChinaMax-IP
        ↓
DIRECT
```

Apple：

```text
Rules/Apple.yaml
        ↓
Apple
        ↓
DIRECT

MRS/Apple_Domain.mrs
        ↓
Apple-Domain
        ↓
DIRECT
```

以上只是策略配置示例，实际使用时可以根据自己的分流需求将规则指向不同策略。

---

# 六、YAML 与 MRS

本仓库中的 YAML 与 MRS 文件属于同一规则体系的不同组成部分。

因此，本仓库不是：

```text
YAML 或 MRS
```

而是：

```text
YAML
+
对应 MRS
```

其中 ChinaMax 还包含：

```text
YAML
+
Domain MRS
+
IP MRS
```

完整关系：

```text
ChinaMax
= Rules/ChinaMax.yaml
+ MRS/ChinaMax_Domain.mrs
+ MRS/ChinaMax_IP.mrs

Advertising
= Rules/Advertising.yaml
+ MRS/Advertising_Domain.mrs

AdvertisingLite
= Rules/AdvertisingLite.yaml
+ MRS/AdvertisingLite_Domain.mrs

Privacy
= Rules/Privacy.yaml
+ MRS/Privacy_Domain.mrs

Apple
= Rules/Apple.yaml
+ MRS/Apple_Domain.mrs
```

请按照上述关系完整配置。

---

# 七、自动更新

本仓库使用 GitHub Actions 自动同步规则并转换 MRS。

基本流程：

```text
上游规则
    ↓
GitHub Actions
    ↓
同步 YAML
    ↓
Rules/
```

需要生成 MRS 的规则：

```text
上游规则
    ↓
GitHub Actions
    ↓
Mihomo
    ↓
MRS/
```

当上游规则发生变化时，GitHub Actions 会自动更新对应文件。

如果规则没有发生变化，则不会产生新的规则内容提交。

---

# 八、更新内容

本仓库中的规则会随着上游规则更新而变化。

因此：

* 规则数量可能发生变化
* 规则内容可能发生变化
* 规则匹配范围可能发生变化
* MRS 文件可能重新生成

如果发现规则行为发生变化，请检查本仓库对应文件的最新版本。

---

# 九、第三方资源说明

本仓库中的规则资源主要来自：

[https://github.com/blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script)

本仓库不将第三方规则声明为原创。

第三方规则的：

* 原始内容
* 数据来源
* 作者
* 版权及其他权利
* 许可证
* 使用条件
* 发布限制

均以上游项目及相关权利人的当前说明为准。

本仓库主要提供：

```text
规则同步
+
规则整理
+
MRS 格式转换
```

如果相关权利人对资源的转载、镜像或分发提出要求，应按照相关权利人的要求处理。

---

# 十、使用注意事项

1. 请按照本 README 中列出的组合方式添加规则。

2. 同一规则对应的 YAML 与 MRS 文件需要同时配置。

3. ChinaMax 需要同时配置 YAML、Domain MRS 和 IP MRS。

4. 不要遗漏同一规则对应的 MRS 文件，否则可能导致规则匹配不完整。

5. 不要将 `.mrs` 文件当作 YAML 文件编辑。

6. MRS 文件由 GitHub Actions 自动生成和更新。

7. 上游规则更新后，本仓库中的规则内容也可能发生变化。

8. 如果出现误拦截、漏匹配或访问异常，请检查规则内容、规则顺序以及策略组配置。

---

# 十一、免责声明

本仓库主要用于网络规则整理、格式转换及技术研究。

本仓库不对第三方规则的准确性、完整性、有效性、适用性或合法性作出保证。

第三方规则可能存在误匹配、遗漏或过时内容，并可能随着上游项目更新而发生变化。

因使用第三方规则导致的网络访问异常、误拦截、服务异常或其他问题，应根据实际情况检查相关规则及客户端配置。

使用本仓库及其中的第三方资源前，请自行确认相关资源的许可证、使用条件以及所在地适用的法律法规。

本仓库不代表任何第三方项目、作者或服务提供方。

---

# 上游项目

**blackmatrix7/ios_rule_script**

[https://github.com/blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script)

规则目录：

[https://github.com/blackmatrix7/ios_rule_script/tree/master/rule](https://github.com/blackmatrix7/ios_rule_script/tree/master/rule)

```

这版的组合关系就统一了：**5 套规则全部按照“YAML + MRS”来写，ChinaMax 是“YAML + Domain MRS + IP MRS”。** 不再出现“或者使用 MRS”“二选一”这种容易误导群友的表述。
```

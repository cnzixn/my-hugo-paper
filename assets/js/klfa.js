/**
 * KLFA.js - 资源文件打包/解包工具
 * 版本: 1.0.0
 * 功能: 提供KLFA格式资源的打包和解包功能
 */

class KLFA {
    /**
     * 解包KLFA资源文件
     * @param {ArrayBuffer|Uint8Array} data - KLFA格式的资源文件数据
     * @returns {Promise<Array<{name: string, size: number, data: Uint8Array}>>} 解包后的文件列表
     * @throws {Error} 如果数据格式无效或解包失败
     */
    static async unpack(data) {
        if (!(data instanceof ArrayBuffer)) {
            if (data instanceof Uint8Array) {
                data = data.buffer;
            } else {
                throw new Error('无效的数据类型，必须是ArrayBuffer或Uint8Array');
            }
        }
    
        const dataView = new DataView(data);
        const header = String.fromCharCode.apply(null, new Uint8Array(data.slice(0, 4)));
        
        // 验证文件头
        if (header !== 'KLFA') {
            throw new Error('无效的KLFA文件格式: 文件头应为KLFA');
        }
    
        // 读取文件数量
        const fileCount = dataView.getUint32(4, true);
        let offset = 8; // 跳过文件头和文件数量
        const files = [];
    
        // 解包每个文件
        for (let i = 0; i < fileCount; i++) {
            // 读取文件名长度
            const nameSize = dataView.getUint32(offset, true);
            offset += 4;
    
            // 读取文件名（UTF-8解码）
            const nameArray = new Uint8Array(data.slice(offset, offset + nameSize));
            const fileName = new TextDecoder('utf-8').decode(nameArray);
            offset += nameSize;
    
            // 读取文件偏移量
            const fileOffset = dataView.getUint32(offset, true);
            offset += 4;
    
            // 读取文件大小
            const fileSize = dataView.getUint32(offset, true);
            offset += 4;
    
            // 跳过dummy字节
            offset += 1;

            // 提取文件数据
            const fileData = new Uint8Array(data.slice(fileOffset, fileOffset + fileSize));
    
            files.push({
                name: fileName,
                size: fileSize,
                data: fileData
            });
        }
    
        return files;
    }

    /**
     * 打包文件为KLFA格式
     * @param {Array<{name: string, data: Uint8Array}>} files - 要打包的文件列表
     * @returns {Promise<Uint8Array>} 打包后的KLFA数据
     * @throws {Error} 如果打包失败
     */
    static async pack(files) {
        if (!Array.isArray(files) || files.length === 0) {
            throw new Error('必须提供至少一个文件');
        }

        // 计算文件头长度
        let headerSize = 8; // KLFA + 文件数量
        const encoder = new TextEncoder();

        for (const file of files) {
            if (!file.name || !file.data) {
                throw new Error('每个文件必须包含name和data属性');
            }

            const nameBytes = encoder.encode(this.normalizeFileName(file.name));
            headerSize += 4 + nameBytes.length + 8 + 1; // 文件名长度 + 文件名 + 偏移量 + 大小 + dummy
        }

        // 计算总数据大小
        const totalDataSize = files.reduce((sum, file) => sum + file.data.length, 0);
        const totalArchiveSize = headerSize + totalDataSize;

        // 创建ArrayBuffer
        const buffer = new ArrayBuffer(totalArchiveSize);
        const dataView = new DataView(buffer);
        const headerArray = new Uint8Array(buffer, 0, headerSize);
        const dataArray = new Uint8Array(buffer, headerSize);

        // 写入文件头
        // KLFA
        headerArray[0] = 'K'.charCodeAt(0);
        headerArray[1] = 'L'.charCodeAt(0);
        headerArray[2] = 'F'.charCodeAt(0);
        headerArray[3] = 'A'.charCodeAt(0);

        // 文件数量
        dataView.setUint32(4, files.length, true);

        let headerOffset = 8;
        let dataOffset = 0;

        // 写入文件信息
        for (const file of files) {
            const nameBytes = encoder.encode(this.normalizeFileName(file.name));

            // 文件名长度
            dataView.setUint32(headerOffset, nameBytes.length, true);
            headerOffset += 4;

            // 文件名
            for (let j = 0; j < nameBytes.length; j++) {
                headerArray[headerOffset++] = nameBytes[j];
            }

            // 文件偏移量
            dataView.setUint32(headerOffset, headerSize + dataOffset, true);
            headerOffset += 4;

            // 文件大小
            dataView.setUint32(headerOffset, file.data.length, true);
            headerOffset += 4;

            // dummy字节
            headerArray[headerOffset++] = 0;

            // 复制文件数据
            dataArray.set(file.data, dataOffset);
            dataOffset += file.data.length;
        }

        return new Uint8Array(buffer);
    }

    /**
     * 标准化文件名
     * @private
     * @param {string} name - 原始文件名
     * @returns {string} 标准化后的文件名
     */
    static normalizeFileName(name) {
        // 确保UTF-8编码
        try {
            const encoder = new TextEncoder();
            const decoder = new TextDecoder('utf-8', { fatal: true });
            const bytes = encoder.encode(name);
            decoder.decode(bytes);
        } catch (e) {
            console.warn('文件名包含非UTF-8字符:', name);
        }

        return name.replace(/\\/g, '/')          // 统一使用正斜杠
                   .replace(/^\.+\//, '')       // 移除开头的相对路径
                   .replace(/\/\.+\//g, '/')    // 移除中间的相对路径
                   .replace(/\/+/g, '/');       // 合并连续斜杠
    }

    /**
     * 验证文件名是否有效
     * @private
     * @param {string} name - 要验证的文件名
     * @returns {boolean} 是否有效
     */
    static isValidFileName(name) {
        if (!name || name.length === 0) return false;
        // 禁止控制字符和特殊字符
        if (/[\x00-\x1F\x7F<>:"|?*]/.test(name)) return false;
        // 禁止以点开头（隐藏文件）
        if (/^\./.test(name)) return false;
        return true;
    }
}

// 根据环境导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KLFA;
} else if (typeof define === 'function' && define.amd) {
    define([], function() { return KLFA; });
} else {
    window.KLFA = KLFA;
}
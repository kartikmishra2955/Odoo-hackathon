function generateAssetTag(id) {
    const year = new Date().getFullYear();

    return `AST-${year}-${String(id).padStart(4, "0")}`;
}

module.exports = generateAssetTag;
# Vercel Deployment Checklist

## Issues Fixed

### 1. ✅ Removed Heavy Font Loading
- **Before**: Loading 30+ font families from Google Fonts
- **After**: Only loading Inter font family
- **Impact**: Faster page load, fewer network requests

### 2. ✅ Fixed Missing Return Statement
- **Issue**: `buildNewsDataUrl()` wasn't returning the URL
- **Fixed**: Added `return` statement
- **Impact**: API calls now work correctly

### 3. ✅ Simplified Top Headlines
- **Before**: Using NewsAPI with potential CORS issues
- **After**: Using NewsData.io exclusively for headlines
- **Impact**: More reliable, no CORS errors

### 4. ✅ Removed Replit Script
- **Before**: Had Replit dev banner script
- **After**: Removed unnecessary external script
- **Impact**: Cleaner production build

## Vercel Environment Variables

Make sure these are set in your Vercel project settings:

```
VITE_NEWSDATA_API_KEY=pub_057b1f4feec14f1aa5f6634c54e68f96
VITE_NEWSAPI_KEY=5a3916425a96448d8e45a34d1cc1124a (optional)
```

### How to Add Environment Variables on Vercel:

1. Go to your project on Vercel
2. Click **Settings**
3. Click **Environment Variables**
4. Add each variable:
   - Name: `VITE_NEWSDATA_API_KEY`
   - Value: `pub_057b1f4feec14f1aa5f6634c54e68f96`
   - Environment: Production, Preview, Development (check all)
5. Click **Save**
6. **Redeploy** your project for changes to take effect

## Build Settings

Verify these settings in Vercel:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Root Directory**: `.` (leave empty or set to root)

## After Deployment

### Check Console for Errors
1. Open your deployed site
2. Open browser DevTools (F12)
3. Check Console tab for:
   - ✅ Should see: `[newsApi] NewsData key loaded: pub_057b1f...`
   - ❌ Should NOT see: API key warnings or CORS errors

### Verify Slider
- Homepage should show rotating news banner
- If you see "Loading headlines..." for more than 5 seconds, check:
  1. Environment variables are set correctly
  2. API key is valid
  3. Console for specific error messages

### Test Navigation
- Click header links → Page should scroll to top
- Click article cards → Should open article page internally
- Click categories → Should load category-specific news

## Common Issues & Solutions

### Issue: Slider shows "Loading headlines..." forever
**Solution**: 
- Verify `VITE_NEWSDATA_API_KEY` is set in Vercel
- Redeploy after adding env vars
- Check API key is valid at newsdata.io

### Issue: No articles loading
**Solution**:
- Check browser console for API errors
- Verify API key hasn't exceeded rate limits
- Try a different API key

### Issue: Animations not working
**Solution**:
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Check console for JavaScript errors

### Issue: Images not loading
**Solution**:
- This is normal for some articles (broken source URLs)
- Default fallback image will show
- No action needed

## Performance Tips

1. **Enable Vercel Analytics** for monitoring
2. **Use Vercel Edge Network** (automatic)
3. **Enable Compression** (automatic in Vercel)
4. **Monitor API Rate Limits** on NewsData.io dashboard

## Support

If issues persist:
1. Check Vercel deployment logs
2. Review browser console errors
3. Verify all environment variables are set
4. Try a fresh deployment

---

Last Updated: 2025-01-04

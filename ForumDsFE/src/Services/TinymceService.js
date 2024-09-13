// import React, { useRef, useEffect } from 'react';
// import tinymce from 'tinymce/tinymce';

// // Thêm các plugin bạn muốn sử dụng (ví dụ: link, lists, autolink, autosave, paste, ...)
// import 'tinymce/plugins/link';
// import 'tinymce/plugins/lists';
// import 'tinymce/plugins/autolink';
// import 'tinymce/plugins/autosave';

// // Thêm skin và theme (ví dụ: skin-ui-dark và theme-dark)
// import 'tinymce/skins/ui/oxide-dark/skin.css';

// const TinymceService = ({ value, onChange }) => {
//   const tinymceRef = useRef(null);

//   useEffect(() => {
//     const initTinyMCE = async () => {
//       if (!tinymceRef.current) return;

//       tinymceRef.current.innerHTML = value; // Set initial content
//       tinymceRef.current.addEventListener('input', handleInput);

//       try {
//         await tinymce.init({
//           selector: `#${tinymceRef.current.id}`,
//           height: 500,
//           plugins: ['link', 'lists', 'autolink', 'autosave', 'paste'], // Thêm các plugin bạn muốn sử dụng
//           skin: 'oxide-dark',
//           theme: 'dark',
//           setup: (editor) => {
//             // Lắng nghe sự kiện thay đổi nội dung và gọi hàm onChange
//             editor.on('change', () => {
//               if (onChange) {
//                 onChange(editor.getContent());
//               }
//             });
//           },
//         });
//       } catch (error) {
//         console.error('TinyMCE initialization error:', error);
//       }
//     };

//     initTinyMCE();

//     return () => {
//       if (tinymceRef.current) {
//         tinymceRef.current.removeEventListener('input', handleInput);
//       }
//     };
//   }, [value]);

//   const handleInput = () => {
//     if (tinymceRef.current && onChange) {
//       const content = tinymceRef.current.innerHTML;
//       onChange(content);
//     }
//   };

//   return (
//     <div>
//       <div ref={tinymceRef} id="tinymce-editor" />
//     </div>
//   );
// };

// export default TinymceService;

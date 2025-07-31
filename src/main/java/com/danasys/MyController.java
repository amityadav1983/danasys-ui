package com.danasys;


import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.danasys.dto.ProductCategoryDTO;
import com.danasys.dto.ProductDTO;
import com.danasys.dto.UserProfileDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping
@Tag(name = "Danasys API's", description = "APIs for danasys e-commerce functionality")
public class MyController {

	@GetMapping("/getUser")
	@Operation(summary = "Get user details", description = "API for get user details")
	public UserProfileDTO getUser(@RequestParam(value = "userProfileId", required = true) Long userProfileId) {
		UserProfileDTO profile = new UserProfileDTO();
		profile.setEmail("dana@dana.com");
		profile.setFullname("John");
		profile.setUserProfilePicture("/user.jpg");
		profile.setContactInfo("91111111111");
		profile.setFullAddress("House No-102, Pocket-5, Noida Sec-62, UP-201301");
		return profile;
	}
	
	@GetMapping("/productList")
	@Operation(summary = "Product list", description = "Provide list of product for registered user")
	public List<ProductDTO> productList() throws IOException {
	
		 List<ProductDTO> prodicts = getAllOtherProducts(1l);
		 
		 return prodicts;
		
	}
	
	@GetMapping("/productCategoryList")
	@Operation(summary = "Product category list", description = "All listed product category")
	public List<ProductCategoryDTO> productCategoryList() throws IOException {
		List<ProductCategoryDTO> list = new ArrayList<>();
		ProductCategoryDTO dto1 = new ProductCategoryDTO();
		dto1.setId(1l);
		dto1.setCategoryName("Grocery");
		dto1.setDescription("Grocerys");
		dto1.setStatus("ACTIVE");
		
		ProductCategoryDTO dto2 = new ProductCategoryDTO();
		dto2.setId(1l);
		dto2.setCategoryName("Vegitabled");
		dto2.setDescription("Grocerys");
		dto2.setStatus("ACTIVE");
		
		ProductCategoryDTO dto3 = new ProductCategoryDTO();
		dto3.setId(1l);
		dto3.setCategoryName("Faishon");
		dto3.setDescription("Grocerys");
		dto3.setStatus("ACTIVE");
		
		list.add(dto1);
		list.add(dto2);
		list.add(dto3);
		
		return list;
	}
	
	public List<ProductDTO> getAllOtherProducts(Long userProfileId) throws IOException {
		PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] resources = resolver.getResources("classpath:static/groceries/*.*");
        List<ProductDTO> products = new ArrayList();
		Long id = 100000l;
		 for (Resource resource : resources) {
			id = id + 1;
			String fileName = resource.getFilename().toLowerCase();

			if (fileName.endsWith(".jpg") || fileName.endsWith(".png") || fileName.endsWith(".jpeg")) {
				ProductDTO product = new ProductDTO();
				product.setName(fileName);

				String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
						.path("/groceries/").path(resource.getFilename()).toUriString();

				product.setImage(imageUrl);
				product.setCategory("Grocery");
				product.setMoreAbout("good product");
				product.setOfferPrice(100d);
				product.setPrice(120d);
				product.setQuantity(10);
				product.setDescription("good product");
				product.setBusinessUserProfileId(userProfileId);
				product.setId(id);

				products.add(product);
				
			}
		}

		return products;
	}
}

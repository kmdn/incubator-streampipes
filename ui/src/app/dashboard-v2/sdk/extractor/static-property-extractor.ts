/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {EventSchema} from "../../../connect/schema-editor/model/EventSchema";
import {StaticProperty} from "../../../connect/model/StaticProperty";
import {MappingPropertyUnary} from "../../../connect/model/MappingPropertyUnary";
import {FreeTextStaticProperty} from "../../../connect/model/FreeTextStaticProperty";
import {ColorPickerStaticProperty} from "../../../connect/model/ColorPickerStaticProperty";
import {MappingPropertyNary} from "../../../connect/model/MappingPropertyNary";
import {OneOfStaticProperty} from "../../../connect/model/OneOfStaticProperty";

export class StaticPropertyExtractor {

    constructor(private inputSchema: EventSchema,
                private staticProperties: Array<StaticProperty>) {

    }

    hasStaticProperty(internalId: string): boolean {
        return this.getStaticPropertyByName(internalId) !== undefined;
    }

    mappingPropertyValue(internalId: string): string {
        let sp: MappingPropertyUnary = this.getStaticPropertyByName(internalId) as MappingPropertyUnary;
        return this.removePrefix(sp.selectedProperty);
    }

    mappingPropertyValues(internalId: string): Array<string> {
        let sp: MappingPropertyNary = this.getStaticPropertyByName(internalId) as MappingPropertyNary;
        let properties: Array<string> = [];
        // TODO this quick-fixes a deserialization bug in Tson-LD
        if (!Array.isArray(sp.selectedProperties)) {
            let value: string = sp.selectedProperties as any;
            sp.selectedProperties = [value];
        }
        sp.selectedProperties.forEach(ep => {
           properties.push(this.removePrefix(ep));
        });
        return properties;
    }

    singleValueParameter(internalId: string): any {
        let sp: FreeTextStaticProperty = this.getStaticPropertyByName(internalId) as FreeTextStaticProperty;
        return sp.value;
    }

    selectedColor(internalId: string): any {
        let sp: ColorPickerStaticProperty = this.getStaticPropertyByName(internalId) as ColorPickerStaticProperty;
        return sp.selectedColor;
    }

    selectedSingleValue(internalId: string): string {
        let sp: OneOfStaticProperty = this.getStaticPropertyByName(internalId) as OneOfStaticProperty;
        return sp.options.find(o => o.selected).name;
    }

    stringParameter(internalId: string): string {
        return this.singleValueParameter(internalId) as string;
    }

    integerParameter(internalId: string): number {
        return this.singleValueParameter(internalId) as number;
    }

    getStaticPropertyByName(internalId: string): StaticProperty {
        return this.staticProperties.find(sp => (sp.internalName == internalId));
    }


    removePrefix(propertyValue: string) {
        return propertyValue.split("::").length > 1 ? propertyValue.split("::")[1] : propertyValue;
    }

}